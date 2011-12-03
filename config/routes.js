var mongoose = require('mongoose'),
  User = mongoose.model('User');

function onUserView(user, res, format){
  if (format === 'json'){
    res.send(JSON.stringify(user));
  } else {
    res.render('show', {
      title: user.fb.name.full,
      user: user
    });
    
    if (!user.photos.length){
      // kick off fetching photos, even though we have already responded to the request
      user.fetchPhotos(function(photos){
        // res.send(JSON.stringify(user));
      });
    }
  }
}

module.exports = function(app, mongooseAuth, everyauth){
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

  app.get('/:fbId.:format?', function(req, res){
    var fbId = req.params.fbId,
      user = req.user;
    
    if (user && user.fb && user.fb.id === fbId){
      // current user viewing themselves
      onUserView(user, res, req.params.format);
    } else {
      User.findOne({'fb.id': fbId}, function(err, user){
        if (user){
          onUserView(user, res, req.params.format);
        }
      });
    }
  });


  mongooseAuth.helpExpress(app);
  everyauth.helpExpress(app);
};
