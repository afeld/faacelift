var mongoose = require('mongoose'),
  face = require('node-face'),
  PhotoSchema = require('./photo.js').PhotoSchema,
  _u = require('underscore'),
  util = require('util');

var UserSchema = new mongoose.Schema({
  // mongoose-auth adds fields as well
  photos: [PhotoSchema],
});

UserSchema.methods.fetchPhotos = function(options){
  console.log('fetching photos for user fbid:' + this.fb.id);
  
  var params = _u.extend({
    scope: this
  }, options);
  
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
        if (params.success){
          params.success.call(params.scope, self.photos);
        }
      });
    },
    error: function(err, response, body){
      console.log('photos retrieval failed for user fbid:' + this.fb.id + ' - ' + util.inspect(body));
      if (params.error){
        params.error.apply(params.scope, arguments);
      }
    },
    scope: this
  });
};


UserSchema.methods.photoDataAsPx = function(){
   return _u.map(this.photos, function(photo){
     return face.photoDataToPx(photo);
   });
};


exports.UserSchema = UserSchema;
