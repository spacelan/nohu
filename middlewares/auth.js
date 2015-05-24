var restify = require('restify');
var User = require('../models').User;
var jwt = require('jsonwebtoken');
var secret = require('../config.js').tokenSecret;

module.exports.authorization = function(req, res, next) {
  var token = req.header('Authorization', null);
  if(!token)
    return next(new restify.MissingParameterError('need token'));

  jwt.verify(token, secret, function(err,decoded) {
    if(err)
      return next(new restify.InvalidCredentialsError(err.message));

    User.findOne({id: decoded.id}, function(err, user) {
      next.ifError(err);

      var errMsg;
      if(!user)
        errMsg = 'invalid id';
      else if(user.password !== decoded.password)
        errMsg = 'expired password';
      if(errMsg)
        return next(new restify.InvalidCredentialsError(errMsg));

      req.user = user;
      return next();
    });
  });
};

module.exports.generateToken = function(user) {
  return {
    token: jwt.sign({id: user.id, password: user.password}, secret, {
      expiresInMinutes: 10080
    }),
    expire_in: 10080
  };
};