
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

if (!process.env.FAACELIFT_FB_APP_ID){
	throw "FAACELIFT_FB_APP_ID must be set";
}
if (!process.env.FAACELIFT_FB_SECRET){
  throw "FAACELIFT_FB_SECRET must be set";
}
if (!process.env.FAACELIFT_FACE_API_KEY){
  throw "FAACELIFT_FACE_API_KEY must be set";
}
if (!process.env.FAACELIFT_FACE_API_SECRET){
  throw "FAACELIFT_FACE_API_SECRET must be set";
}

app.configure('development', function(){
  everyauth.debug = true;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://localhost/faacelift_dev');
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/faacelift_prod');
});


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
      myHostname: 'http://localhost:3000',
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


// Routes

app.get('/', function(req, res){
  var user = req.user;
  if (user && user.fb && user.fb.id){
    res.redirect('/' + user.fb.id);
  } else {
    // force them to log in
    res.redirect(everyauth.facebook.entryPath());
    
    // res.render('index', {
    //   title: 'Express'
    // });
  }
});

app.get('/:fbId', function(req, res){
  var fbId = req.params.fbId,
    user = req.user;
  
  if (user && user.fb && user.fb.id === fbId){
    // current user viewing themselves
    onUserView(user, res);
  } else {
    User.findOne({'fb.id': fbId}, function(err, user){
      if (user){
        onUserView(user, res);
      }
    });
  }
});


function onUserView(user, res){
  if (user.photos.length){
    res.send(JSON.stringify(user))
  } else {
    user.fetchPhotos(function(photos){
      res.send(JSON.stringify(user));
    });
  }
}


mongooseAuth.helpExpress(app);
everyauth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
