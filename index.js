// START HEROKU SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res){ res.send('The robot is happily running.'); });
app.listen(process.env.PORT || 5000);
// END HEROKU SETUP


// Listbot config
//
// Config.keys uses environment variables so sensitive info is not in the repo.
var config = {
    me: 'FishMojiApp', // The authorized account with a list to retweet.
    myList: 'Bass-pros-industry', // The list we want to retweet.
    regexFilter: '', // Accept only tweets matching this regex pattern.
    regexReject: '(RT|@)', // AND reject any tweets matching this regex pattern.


    keys: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
};


// Get the members of our list, and pass them into a callback function.
function getListMembers(callback) {
    var memberIDs = [];

    tu.listMembers({owner_screen_name: config.me,
        slug: config.myList
    },
    function(error, data){
        if (!error) {
            for (var i=0; i < data.users.length; i++) {
                memberIDs.push(data.users[i].id_str);
            }

            // This callback is designed to run listen(memberIDs).
            callback(memberIDs);
        } else {
            console.log(error);
            console.log(data);
        }
    });
}

// What to do after we retweet something.
function onReTweet(err) {
    if(err) {
        console.error("retweeting failed :(");
        console.error(err);
    }
}
function onFavorite(err) {
    if(err) {
        console.error("Favorite failed :(");
        console.error(err);
    }
     else {
        console.log('success')
    }
}

// What to do when we get a tweet.
function onTweet(tweet, tag) {
    console.log(tweet);
    // Reject the tweet if:
    //  1. it's flagged as a retweet
    //  2. it matches our regex rejection criteria
    //  3. it doesn't match our regex acceptance filter
    var regexReject = new RegExp(config.regexReject, 'i');
    var regexFilter = new RegExp(config.regexFilter, 'i');
    if (tweet.retweeted) {
        return;
    }
    if (config.regexReject !== '' && regexReject.test(tweet.text)) {
        return;
    }
    if (regexFilter.test(tweet.text)) {
        let hashTags = tweet.entities.hashtags;
        var bfGood = false;
        hashTags.forEach(function(ht){
            var term = ht.text.toLowerCase();
            if(term === 'bassfishing'){
                bfGood = true;
                console.log('GOOD', term);
            }
        });

        if(bfGood){
            console.log(tweet);
            tu.createFavorite({
                id: tweet.id_str
            }, onFavorite);
        }
        if(!tag){
            console.log(tweet);
            console.log("RT: " + tweet.text);
            // Note we're using the id_str property since javascript is not accurate
            // for 64bit ints.
            tu.retweet({
                id: tweet.id_str
            }, onReTweet);
        }
    }
}

// Function for listening to twitter streams and retweeting on demand.
function listen(listMembers) {
    tu.filter({
        track: '#bassfishing'
    }, function(stream) {
        console.log("listening to stream");
        var tag = true;
        stream.on('tweet', function (tweet){
            onTweet(tweet, tag);
        })
    });
    tu.filter({
        follow: listMembers
    }, function(stream) {
        console.log("listening to stream");
        stream.on('tweet', onTweet);
    });
    
}
//Can add more filters / watchers here.


// The application itself.
// Use the tuiter node module to get access to twitter.
var tu = require('tuiter')(config.keys);

// Run the application. The callback in getListMembers ensures we get our list
// of twitter streams before we attempt to listen to them via the twitter API.
getListMembers(listen);
