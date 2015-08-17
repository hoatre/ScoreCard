var jwt = require('jwt-simple');
var User = require('../models/User.js');
var createJWT = require('../services/createJWT.js');

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
exports.login = function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Wrong email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
};

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
exports.signup = function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayname: req.body.displayName,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function() {
      res.send({ token: createJWT(user) });
    });
  });
};