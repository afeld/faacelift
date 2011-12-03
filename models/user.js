var mongoose = require('mongoose'),
  face = require('node-face'),
  PhotoSchema = require('./photo.js').PhotoSchema;

var UserSchema = new mongoose.Schema({
  // mongoose-auth adds fields as well
  photos: [PhotoSchema],
});

UserSchema.methods.fetchPhotos = function(callback, scope){
  console.log('fetching photos for user fbid:' + this.fb.id);
  
  face.facebook.get({
    uids: this.fb.id,
    user_auth: {
      fb_user: this.fb.id,
      fb_oauth_token: this.fb.accessToken
    },
    success: function(data){
      console.log('photos retrieved for user fbid:' + this.fb.id);
      
      var self = this;
      data.photos.forEach(function(photo){
        // var doc = new Photo(photo);
        self.photos.push(photo);
      });
      
      this.save(function(err){
        callback.call(scope, self.photos);
      });
    },
    error: function(){
      console.log('photos retrieval failed for user fbid:' + this.fb.id + ' - ' + util.inspect(arguments));
    },
    scope: this
  });
};

exports.UserSchema = UserSchema;
