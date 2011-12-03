var UserSchema = require('../models/user.js').UserSchema;

module.exports = function(mongoose, mongooseAuth){
  if (!process.env.FAACELIFT_FB_APP_ID){
    throw "FAACELIFT_FB_APP_ID must be set";
  }
  if (!process.env.FAACELIFT_FB_SECRET){
    throw "FAACELIFT_FB_SECRET must be set";
  }

  UserSchema.plugin(mongooseAuth, {
    // Here, we attach your User model to every module
    everymodule: {
      everyauth: {
        User: function () {
          return User;
        }
      }
    },
  
    facebook: {
      everyauth: {
        myHostname: process.env.HOSTNAME ? ('http://' + process.env.HOSTNAME) : 'http://localhost:3000',
        appId: process.env.FAACELIFT_FB_APP_ID,
        appSecret: process.env.FAACELIFT_FB_SECRET,
        scope: 'user_photos',
        redirectPath: '/'
      }
    }
  });
  var User = mongoose.model('User', UserSchema);
};
