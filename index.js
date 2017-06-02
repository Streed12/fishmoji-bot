// START HEROKU SETUP
const express = require('express');
const app = express();
const _ = require('lodash');
//Twitter bot config - store in separate file for cleaner main code
const { config, trackTerms } = require('./config.js')

app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);

// Get the members of our list, and pass them into a callback function.
const getListMembers = (callback) => {
  let listMembers = new Map();
  listMembers.clear();
  let memberIDs = {
    blocked: [],
    following: []
  };

  tu.blocksList({owner_screen_name: config.me}, (error, data) => {
    data.users.forEach(bUser => memberIDs.blocked.push(bUser.id_str))
  })

  tu.listMembers({owner_screen_name: config.me,
      slug: config.list,
      count: 500
  }, (error, data) => {
      if (!error) {
        for (let i = 0; i < data.users.length; i++) {
          listMembers.set(data.users[i].id_str, data.users[i].screen_name);
          memberIDs.following.push(data.users[i].id_str);
        }
        // This callback is designed to run listen(memberIDs and listMembers).
        callback(memberIDs, listMembers);
      } else {
        console.log(error);
        console.log(data);
      }
  });
  
}

// What to do after we retweet something.
const onReTweet = (err) => {
  if(err) {
      console.error("retweeting failed :(");
      console.error(err);
  } else {
      console.log('success retweet')
  }
}
// What to do after we favorite something.
const doFavorite = (err) => {
  if(err) {
      console.error("Favorite failed :(");
      console.error(err);
  }
   else {
      console.log('success')
  }
}

// What to do when we get a tweet.
const onTweet = (tweet, blocked, listMembers) => {

  // Destructure the tweet info we want
  const { id_str, user, text } = tweet;
  // Destructure the tweet properties we want to check as filters
  const { in_reply_to_status_id: inReply, in_reply_to_user_id: replyUser, retweeted, filter_level, lang } = tweet;
  // Reject the tweet if:
  //  1. it's flagged as a retweet
  //  2. it matches our regex rejection criteria
  //  3. it doesn't match our regex acceptance filter
  let regexReject = new RegExp(config.regexReject, 'i');
  let regexFilter = new RegExp(config.regexFilter, 'i');
  
  // Ignores tweets from blocked users on account
  if(_.includes(blocked, user.id_str)){
    return;
  }
  if (retweeted || inReply || replyUser || lang !== 'en' || filter_level !== 'low') {
      return;
  }
  if (config.regexReject !== '' && regexReject.test(text)) {
      return;
  }

  if (regexFilter.test(text)) {
    if(listMembers.has(user.id_str)){
      tu.retweet({
        id: id_str
      }, onReTweet)
      
    } else {
      tu.createFavorite({
        id: id_str
      }, doFavorite);
      
      // If we wanted to add friends / follow users when we liked the tweet.

      // tu.createFriendship({
      //   id: user.id_str,
      //   follow: true
      // }, doFavorite)
    }   
  } 
}

// Function for listening to twitter streams and retweeting on demand.
const listen = (memberIDs, listMembers) => {
  let { blocked, following } = memberIDs
  tu.filter({
    follow: following,
    track: trackTerms
  }, function(stream) {
      console.log("listening to stream")
      stream.on('tweet', (tweet) => {
          onTweet(tweet, blocked, listMembers)
      });
  });
}

// The application itself.
// Use the tuiter node module to get access to twitter.
let tu = require('tuiter')(config.keys);

// Run the application. The callback in getListMembers ensures we get our list
// of twitter streams before we attempt to listen to them via the twitter API.
getListMembers(listen);
