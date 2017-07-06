const request = require('request');
const gm = require('gm');
const fs = require('fs')


module.exports = (imgUrl) => {
  return new Promise((resolve, reject) => {
    gm(request(imgUrl))
    .draw(['image Over 0,0 150,150 ' + __dirname + `/assets/emoji-small/14.png`])
    .toBuffer('PNG', function (err, buffer) {
      if (err) reject(err);
      resolve(buffer.toString('base64'));
    })
  })
}