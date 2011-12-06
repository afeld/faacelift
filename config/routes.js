var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  request = require('request');

function onUserView(user, req, res, everyauth){
  if (req.params.format === 'json'){
    res.send(JSON.stringify(user));
  } else {
    if (user.photos.length){
      renderView(res, user);
    } else {
      // kick off fetching photos, even though we have already responded to the request
      user.fetchPhotos({
        success: function(photos){
          renderView(res, user);
        },
        error: function(err, response, body){
          // token expired - we should reauthenitcate, but token doesn't get replaced,
          // see https://github.com/bnoguchi/mongoose-auth/issues/60
          // for now, destroy user
          user.remove(function(error){
            res.redirect(everyauth.facebook.entryPath());
          });
        }
      });
    }
  }
}

function renderView(res, user){
  var photoData = user.photoDataAsPx();
  
  res.render('show', {
    title: user.fb.name.full,
    user: user,
    user_photo_json: JSON.stringify(photoData)
  });
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
  
  app.get('/proxy', function(req, res){
    var r = request({
      url: req.param('src')
    });
    
    r.pipe(res);
  });

  app.get('/:fbId.:format?', function(req, res){
    var fbId = req.params.fbId,
      user = req.user;
    
    if (user && user.fb && user.fb.id === fbId){
      // current user viewing themselves
      onUserView(user, req, res, everyauth);
    } else {
      User.findOne({'fb.id': fbId}, function(err, user){
        if (user){
          onUserView(user, req, res, everyauth);
        }
      });
    }
  });


  mongooseAuth.helpExpress(app);
  everyauth.helpExpress(app);
};
