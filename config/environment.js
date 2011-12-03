var everyauth = require('everyauth'),
  mongoose = require('mongoose'),
  mongooseAuth = require('mongoose-auth');


module.exports = function(app, express){
  app.use(express.logger());
  
  app.configure('development', function(){
    everyauth.debug = true;
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    mongoose.connect('mongodb://localhost/faacelift_dev');
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
    mongoose.connect(process.env.MONGOHQ_URL);
  });
  
  
  require('../config/everyauth.js')(mongoose, mongooseAuth);
  require('../config/face.js')();
  

  app.configure(function(){
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'hbs');
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
  
  
  require('./routes.js')(app, mongooseAuth, everyauth);
};
