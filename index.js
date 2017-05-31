// START HEROKU SETUP
let express = require("express");
let app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP


// Listbot config
//
// Config.keys uses environment variables so sensitive info is not in the repo.
let config = {
  me: 'FishMojiApp', // The authorized account with a list to retweet.
  list: 'Bass-SM', // The list we want to retweet.
  regexFilter: '', // Accept only tweets matching this regex pattern.
  regexReject: '(@|music|guitar|sex|viral)', // AND reject any tweets matching this regex pattern.

  keys: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  },
};


// Get the members of our list, and pass them into a callback function.
const getListMembers = (callback) => {
  let bassMembers = new Map();
  bassMembers.clear();

  let memberIDs = [];

  tu.listMembers({owner_screen_name: config.me,
      slug: config.list
  }, (error, data) => {
      if (!error) {
        for (let i = 0; i < data.users.length; i++) {
          bassMembers.set(data.users[i].id_str, data.users[i].screen_name);
          memberIDs.push(data.users[i].id_str);
        }

        // This callback is designed to run listen(memberIDs).
        callback(memberIDs, bassMembers);
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
const onTweet = (tweet, fishMembers) => {
    // Reject the tweet if:
    //  1. it's flagged as a retweet
    //  2. it matches our regex rejection criteria
    //  3. it doesn't match our regex acceptance filter
  let regexReject = new RegExp(config.regexReject, 'i');
  let regexFilter = new RegExp(config.regexFilter, 'i');
  if (tweet.retweeted) {
      return;
  }
  if (config.regexReject !== '' && regexReject.test(tweet.text)) {
      return;
  }
  if (regexFilter.test(tweet.text)) {
    if(tweet.filter_level === 'low' &&
      tweet.in_reply_to_status_id === null &&
      tweet.in_reply_to_user_id === null &&
      tweet.lang === 'en') {
        if(fishMembers.has(tweet.user.id_str)){
          tu.retweet({
            id: tweet.id_str
          }, onReTweet)
          
        } else {
          tu.createFavorite({
            id: tweet.id_str
          }, doFavorite);
          
          tu.createFriendship({
            id: tweet.user.id_str,
            follow: true
          }, doFavorite)
        }
    }
  }
}

// Function for listening to twitter streams and retweeting on demand.
const listen = (listMembers, usersList) => {
  tu.filter({
    follow: listMembers,
    track: ['#bassfishing', '#basspro', '#bassmaster', '#flw', '#tacklewarehouse', '#swimbait']
  }, function(stream) {
      console.log("listening to stream")
      stream.on('tweet', (tweet) => {
          onTweet(tweet, usersList)
      });
  });
}

//Can add more filters / watchers here.


// The application itself.
// Use the tuiter node module to get access to twitter.
let tu = require('tuiter')(config.keys);

// Run the application. The callback in getListMembers ensures we get our list
// of twitter streams before we attempt to listen to them via the twitter API.
getListMembers(listen);
