var mongoose = require('./mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  display_name: String,
  avater_url: String,
  reputation: Number
});

var User = mongoose.model('User', UserSchema);
module.exports = User;