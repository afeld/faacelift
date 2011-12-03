var mongoose = require('mongoose'),
  User = mongoose.model('User');

function onUserView(user, res){
  if (user.photos.length){
    res.send(JSON.stringify(user))
  } else {
    user.fetchPhotos(function(photos){
      res.send(JSON.stringify(user));
    });
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


  mongooseAuth.helpExpress(app);
  everyauth.helpExpress(app);
};
