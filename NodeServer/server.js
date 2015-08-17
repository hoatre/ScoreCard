/**
 * Satellizer Node.js Example
 * (c) 2015 Sahat Yalkabov
 * License: MIT
 */

var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var config = require('./config');

var facebookAuth = require('./services/facebookAuth.js');
var foursquareAuth = require('./services/foursquareAuth.js');
var githubAuth = require('./services/githubAuth.js');
var googleAuth = require('./services/googleAuth.js');
var linkedInAuth = require('./services/linkedInAuth.js');
var liveAuth = require('./services/liveAuth.js');
var localAuth = require('./services/localAuth.js');
var twitterAuth = require('./services/twitterAuth.js');
var yahooAuth = require('./services/yahooAuth.js');



mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();

app.set('port', process.env.PORT || 9000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//app.use(express.static(path.join(__dirname, '../../client')));

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/api/me', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayname = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', localAuth.login);

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', localAuth.signup);

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
app.post('/auth/google', googleAuth);

/*
 |--------------------------------------------------------------------------
 | Login with GitHub
 |--------------------------------------------------------------------------
 */
app.post('/auth/github', githubAuth);

/*
 |--------------------------------------------------------------------------
 | Login with LinkedIn
 |--------------------------------------------------------------------------
 */
app.post('/auth/linkedin', linkedInAuth);

/*
 |--------------------------------------------------------------------------
 | Login with Windows Live
 |--------------------------------------------------------------------------
 */
app.post('/auth/live', liveAuth);

/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
app.post('/auth/facebook', facebookAuth);

/*
 |--------------------------------------------------------------------------
 | Login with Yahoo
 |--------------------------------------------------------------------------
 */
app.post('/auth/yahoo', yahooAuth);

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
app.post('/auth/twitter', twitterAuth);

/*
 |--------------------------------------------------------------------------
 | Login with Foursquare
 |--------------------------------------------------------------------------
 */
//app.post('/auth/foursquare', foursquareAuth);


/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
app.get('/auth/unlink/:provider', ensureAuthenticated, function(req, res) {
  var provider = req.params.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'linkedin', 'live', 'twitter', 'yahoo'];

  if (provider.indexOf(providers) === -1) {
    return res.status(400).send('Unknown provider');
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
