const Vision = require('@google-cloud/vision');
const vision = Vision({
  projectId: 'recognizeimages',
  keyFilename: './recognizeImages-9ddaf85c0a94.json'
});

let opts = {
  verbose: true
};

module.exports = async (imgPath) => {
  let visionResults = await vision.detectLabels(imgPath, opts)
  return visionResults[1].responses[0].labelAnnotations;
}


