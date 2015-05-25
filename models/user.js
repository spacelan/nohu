var mongoose = require('./mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var shortid = require('shortid');

var UserSchema = new Schema({
  id: {type: String, default: shortid.generate, unique: true},
  password: {type: String, default: '123456', required: true},
  email: {type: String, default: ''},
  phone: {type: String, unique: true, required: true},
  gender: {type: String, default: ''},
  age: {type: Number, default: 20},
  display_name: {type: String, default: ''},
  avater_url: {type: String, default: ''},
  create_date: {type: Date, default: Date.now},
  update_date: {type: Date, default: Date.now},
  introduction: {type: String, default: ''},
  user_type: {type: String, default: 'Incomplete'}
});

UserSchema.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;