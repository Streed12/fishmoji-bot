module.exports = {
  config: {
    me: 'FishMojiApp', // The authorized account with a list to retweet.
    list: 'Bass-SM', // The list we want to retweet.
    regexFilter: '', // Accept only tweets matching this regex pattern.
    regexReject: '(@|music|guitar|sex|viral|follow)', // AND reject any tweets matching this regex pattern. Can add many more.

    keys: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
  },
  trackTerms: ['#bassfishing', '#basspro', 'fishing', '#bassmaster', '#fishing', '#flwfishing', '#tacklewarehouse', '#swimbait']
};