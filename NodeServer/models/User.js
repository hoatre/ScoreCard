var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayname: String,
  picture: String,
  facebookid: String,
  foursquareid: String,
  googleid: String,
  githubid: String,
  linkedinid: String,
  liveid: String,
  yahooid: String,
  twitterid: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.toJSON = function(){
    var user = this.toObject();
    delete user.password;

    return user;
};

module.exports = mongoose.model('User', userSchema);