
/**
 * Module dependencies.
 */

var express = require('express'),
  everyauth = require('everyauth'),
  face = require('node-face'),
  mongoose = require('mongoose'),
  mongooseAuth = require('mongoose-auth'),
  UserSchema = require('./models/user.js').UserSchema;

var app = module.exports = express.createServer();

// Configuration

everyauth.debug = true;

mongoose.connect('mongodb://localhost/faacelift_dev');

var User;
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
      myHostname: 'http://local.host:3000',
      appId: process.env.FAACELIFT_FB_APP_ID,
      appSecret: process.env.FAACELIFT_FB_SECRET,
      scope: 'user_photos',
      redirectPath: '/'
    }
  }
});
User = mongoose.model('User', UserSchema);

face.init(process.env.FAACELIFT_FACE_API_KEY, process.env.FAACELIFT_FACE_API_SECRET);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  
  // modules needed for everyauth
  app.use(express.cookieParser());
  app.use(express.session({secret: process.env.FAACELIFT_FB_SECRET}));
  app.use(everyauth.middleware());
  app.use(mongooseAuth.middleware());
  
  app.use(express.methodOverride());
  // app.use(app.router); // removed for mongoose-auth
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

mongooseAuth.helpExpress(app);
everyauth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
