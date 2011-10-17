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
  fbToken: undefined
};

exports.User = User;
