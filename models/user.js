var mongoose = require('mongoose'),
  face = require('node-face'),
  PhotoSchema = require('./photo.js').PhotoSchema;

var UserSchema = new mongoose.Schema({
  // mongoose-auth adds fields as well
  photos: [PhotoSchema],
});

UserSchema.methods.fetchPhotos = function(callback, scope){
  face.facebook.get({
    uids: this.fb.id,
    user_auth: {
      fb_user: this.fb.id,
      fb_oauth_token: this.fb.accessToken
    },
    success: function(data){
      var self = this;
      data.photos.forEach(function(photo){
        // var doc = new Photo(photo);
        self.photos.push(photo);
      });
      
      this.save(function(err){
        callback.call(scope, photos);
      });
    },
    scope: this
  });
};

exports.UserSchema = UserSchema;
