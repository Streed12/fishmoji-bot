const Vision = require('@google-cloud/vision');
const vision = Vision({
  projectId: 'recognizeimages',
  keyFilename: './recognizeImages-9ddaf85c0a94.json'
});


let opts = {
  verbose: true
};

let types = [
'labels',
'safeSearch',
'text'
]


const checkSafety = (results) => {
  return Object.keys(results).every(category => {
    if(results[category] === 'VERY_UNLIKELY' || results[category] === 'UNLIKELY'){
      return true;
    }
    return false;
  });
}

const checkLabels = (labels) => {
  return labels.reduce((accum, { description, score }) => {
    if((description.includes('bass') || description.includes('fish')) && score > 0.8){
      accum = true;
    }
    return accum;
  }, false);
}

const checkText = (text) => {
  return text.length === 0;
}


module.exports = async (imgPath) => { 
  try {
    let [ categories, { responses } ] = await vision.detect(imgPath, {types: types, verbose: true})
    let [ { labelAnnotations : labels }, { safeSearchAnnotation : isSafe }, {textAnnotations: text }, ...rest ] = responses;

    if(!checkText(text)){
      return { status: 'failure', type: 'text', message: 'image did not pass text test', info: text }
    }
    if(!checkSafety(isSafe)){
      return { status: 'failure', type: 'safety', message: 'image did not pass safety test', info: isSafe }
    }
    if(!checkLabels(labels)){
      return { status: 'failure', type: 'label', message: 'image did not pass label test', info: labels }
    }

    return { status: 'success', type: 'good', message: 'image passed all checks', info: [text, isSafe, labels] }
  
  } catch(e) {
      throw new Error(e);
    }
}


