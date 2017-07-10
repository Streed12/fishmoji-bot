Based on Twitter Listbot
==================
## In Progress ...

## Unique Application
This project builds out the Twitter Listbot for a specific use case. Extended functionality focuses on recognizing, filtering, and modifying images attached to tweets already meeting our established content criteria. 

### Image Recognition:
Google Cloud Vision API: Request to Cloud Vision returns image data for filtering purposes including: Labels, Text, and SafeSearch services. Results used to validate image relevancy and filter images that are deemed innapropriate or have excessive text overlayed (typically spam).

Image to binary: Prepares image to be posted to Twitter and / or undergo modification via GraphicsMagick.

### Image Filtering: 
Google Cloud Vision API: As mentioned above, values returned from Google Cloud Vision API service are used as primary filters for media. However, tweet content is filtered prior to API call to reduce usage.
(Watson IBM: Planned): Intended to analyze tone for subtle indescrepencies in Google's Cloud Vision results.

### Image Modification:
GraphicsMagick: For this specific use case GraphicsMagick is implemented to alter image by overlaying an emoji. To produce this result, first image converted to binary, then processed, and finally the resulting Buffer is again converted to a binary string required for media upload to Twitter. Resulting media upload response provides a media id used to populate new Twitter status update.

====================================
## Example from Tritter Listbot
This implementation tweets for [@StoriesInData](https://twitter.com/StoriesInData).

## Setup Your Own
1. [Install node.js & npm](http://nodejs.org/download/) (if you haven't already).
2. Download this repo with `git clone git@github.com:bryanbraun/twitter-listbot.git`.
3. Run `npm install` to download dependencies.
4. Open `index.js` and replace the values in the `config` object with your own.
5. [Create a twitter application](https://apps.twitter.com/app/new), grant it the necessary access, and generate your tokens/keys.
6. Deploy the bot to heroku (you can [use these instructions](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) as a guide).

For detailed setup instructions, see my blog post: [How to Set Up a Simple Javascript Twitter Bot](http://www.bryanbraun.com/2014/12/13/how-to-set-up-a-simple-javascript-twitter-bot)

## Credit
Twitter Listbot is written in [node.js](http://nodejs.org/) and based on [Sugendran](https://github.com/sugendran)'s [node-retweeter](https://github.com/sugendran/node-retweeter).

