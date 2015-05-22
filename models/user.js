var mongoose = require('./mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var shortid = require('shortid');

var UserSchema = new Schema({
  id: {type: String, default: shortid.generate},
  password: String,
  email: String,
  phone: String,
  gender: String,
  age: Number,
  display_name: String,
  avater_url: String,
  create_date: {type: Date, default: Date.now},
  introduction: String
});

var salt = bcrypt.genSaltSync();

UserSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, salt);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;