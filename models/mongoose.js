var mongoose = require('mongoose');
var db = require('../config.js').db;

mongoose.connect(db);

module.exports = mongoose;