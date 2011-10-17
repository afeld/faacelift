
/**
 * Module dependencies.
 */

var express = require('express'),
  everyauth = require('everyauth');

var app = module.exports = express.createServer();

everyauth.debug = true;
var usersById = {};
var nextUserId = 0;
var usersByFbId = {};

// Configuration

everyauth.facebook
  .appId(process.env.FAACELIFT_FB_APP_ID)
  .appSecret(process.env.FAACELIFT_FB_SECRET)
  .handleAuthCallbackError( function (req, res) {
    // If a user denies your app, Facebook will redirect the user to
    // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
    // This configurable route handler defines how you want to respond to
    // that.
    // If you do not configure this, everyauth renders a default fallback
    // view notifying the user that their authentication failed and why.
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
    return usersByFbId[fbUserMetadata.id] ||
      (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
  })
  .redirectPath('/');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  
  app.use(express.cookieParser());
  app.use(express.session({secret: process.env.FAACELIFT_FB_SECRET}));
  app.use(everyauth.middleware());
  
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Helpers

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

everyauth.helpExpress(app);
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
