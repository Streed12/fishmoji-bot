module.exports = {
  config: {
    me: '', // The authorized account with a list to retweet.
    list: '', // The list we want to retweet.
    regexFilter: '', // Accept only tweets matching this regex pattern.
    regexReject: '(@|sex|viral|follow)', // AND reject any tweets matching this regex pattern. Can add many more.

    keys: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
  },
  trackTerms: ['ExampleTerm']
};