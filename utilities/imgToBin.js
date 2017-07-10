const base64Img = require('base64-img');

const base64Async = (url) => {
  return new Promise((resolve, reject) => {
    base64Img.requestBase64(url, (err, res, body) => {
      if (err) reject(err);
      else resolve(body)
    })
  });
};

module.exports = async (url) => {
  const b64 = await base64Async(url);
  const b64Stripped = b64.replace(/^data:image\/[a-z]+;base64,/, "");
  return b64Stripped;
};

