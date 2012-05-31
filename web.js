var async   = require('async');
var express = require('express');
var util    = require('util');

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),
  // require('faceplate').middleware({
  //   app_id: process.env.FACEBOOK_APP_ID,
  //   secret: process.env.FACEBOOK_SECRET,
  //   scope:  'user_likes,user_photos,user_photo_video_tags,user_birthday,user_location'
  // })
  require('faceplate').middleware({
    app_id: '371339856249007',
    secret: '37cebdf34b2c6389aca7293386ce6860',
    scope:  'user_likes,user_photos,user_photo_video_tags,user_birthday,user_location'
  })
);

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.dynamicHelpers({
  'host': function(req, res) {
    return req.headers['host'];
  },
  'scheme': function(req, res) {
    req.headers['x-forwarded-proto'] || 'http'
  },
  'url': function(req, res) {
    return function(path) {
      return app.dynamicViewHelpers.scheme(req, res) + app.dynamicViewHelpers.url_no_scheme(path);
    }
  },
  'url_no_scheme': function(req, res) {
    return function(path) {
      return '://' + app.dynamicViewHelpers.host(req, res) + path;
    }
  },
});

function render_page(req, res) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render('index2.html.ejs', {
        layout:    false,
        req:       req,
        app:       app,
        user:      user,
        cookies: req.cookies
      });
    });
  });
}

function handle_facebook_request(req, res) {
  // if the user is logged in
  if (req.facebook.token) {
    async.parallel([
      function(cb) {
        // query 4 friends and send them to the socket for this socket id
        req.facebook.get('/me/friends', { limit: 100 }, function(friends) {

          var filteredFriends = [];

          friends.forEach(function(f) {
            req.facebook.get('/' + f.id, {}, function(ff) {
              if (ff.location && ff.location.name && ff.location.name.match(/Massachusetts$/)) {
                if (filteredFriends.length < 2) {
                  filteredFriends.push(ff);
                }
              }
            });
          });

          req.filteredFriends = filteredFriends;
          cb();
        });
      }
    ], function() {
      render_page(req, res);
    });

  } else {
    render_page(req, res);
  }
}

app.get('/', handle_facebook_request);
app.post('/', handle_facebook_request);
