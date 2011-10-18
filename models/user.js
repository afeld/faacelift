var mongoose = require('mongoose'),
  mongooseAuth = require('mongoose-auth'),
  face = require('node-face');

require('./photo.js');
var Photo = mongoose.model('Photo');

var UserSchema = new mongoose.Schema({
  // mongoose-auth adds fields as well
  photos: [Photo],
});

UserSchema.methods.fetchPhotos = function(){
  face.facebook.get({
    uids: this.fbMetadata.id,
    user_auth: {
      fb_user: this.fbMetadata.id,
      fb_oauth_token: this.fbToken
    },
    success: function(data){
      this.photos.push(data.photos);
    },
    scope: this
  });
};

exports.UserSchema = UserSchema;
