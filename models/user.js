var mongoose = require('mongoose'),
  face = require('node-face'),
  PhotoSchema = require('./photo.js').PhotoSchema,
  _u = require('underscore'),
  util = require('util'),
  Futures = require('futures');


var filters = [];

function init(){
  var yawMax = 40,
    step = 10;
  
  for (var rangeMin = -1 * yawMax; rangeMin < yawMax; rangeMin += step){
    var rangeMax = rangeMin + step;
    filters.push('yaw:' + rangeMin + '~' + rangeMax);
  }
}

var UserSchema = new mongoose.Schema({
  // mongoose-auth adds fields as well
  photos: [PhotoSchema],
});

UserSchema.methods.fetchPhoto = function(options){
  var params = _u.extend({
    attributes: 'none',
    limit: 1,
    uids: this.fb.id,
    user_auth: {
      fb_user: this.fb.id,
      fb_oauth_token: this.fb.accessToken
    },
    success: function(data){
      console.log('photos retrieved for user fbid:' + this.fb.id + ' filter:' + options.filter);
      
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
      console.log('photos retrieval failed for user fbid:' + this.fb.id + ' filter:' + options.filter + ' - ' + util.inspect(body));
      if (params.error){
        params.error.apply(params.scope, arguments);
      }
    },
    scope: this
  }, options);
  
  face.facebook.get(params);
};

UserSchema.methods.fetchPhotos = function(options){
  console.log('fetching photos for user fbid:' + this.fb.id);
  
  var join = Futures.join(options.scope || this);
  
  filters.forEach(_u.bind(function(filter){
    var future = Futures.future(),
      params = {
        filter: filter,
        success: function(data){
          future.fulfill(null, data);
        },        
        error: function(err, response, body){
          future.fulfill(err, body);
        }
      };
    
    join.add(future);
    this.fetchPhoto(params);
  }, this));
  
  join.whenever(function(err, data){
    if (err){
      console.log('join error: ', err, data);
    }
  });
  
  join.when(function(){
    options.success.call(this);
  });
};


UserSchema.methods.photoDataAsPx = function(){
   return _u.map(this.photos, function(photo){
     return face.photoDataToPx(photo);
   });
};


init();
exports.UserSchema = UserSchema;
