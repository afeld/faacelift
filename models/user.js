var face = require('node-face');

var nextUserId = 0;

// constructor
var User = function(fbMetadata, fbToken){
  this.id = ++nextUserId;
  this.fbMetadata = fbMetadata;
  this.fbToken = fbToken;
}

User.prototype = {
  id: undefined,
  fbMetadata: undefined,
  fbToken: undefined,
  photos: [],
  
  fetchPhotos: function(){
    face.facebook.get({
      uids: this.fbMetadata.id,
      user_auth: {
        fb_user: this.fbMetadata.id,
        fb_oauth_token: this.fbToken
      },
      success: this.onPhotosFetched,
      scope: this
    });
  },
  
  // private
  onPhotosFetched: function(data){
    this.photos = this.photos.concat(data.photos);
  }
};

exports.User = User;
