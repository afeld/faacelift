var face = require('node-face');

module.exports = function(){
  if (!process.env.FAACELIFT_FACE_API_KEY){
    throw "FAACELIFT_FACE_API_KEY must be set";
  }
  if (!process.env.FAACELIFT_FACE_API_SECRET){
    throw "FAACELIFT_FACE_API_SECRET must be set";
  }
  
  face.init(process.env.FAACELIFT_FACE_API_KEY, process.env.FAACELIFT_FACE_API_SECRET);
};
