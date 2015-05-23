var restify = require('restify');
var User = require('../models').User;
var jwt = require('jsonwebtoken');
var secret = 'who am i';

module.exports.authorization = function(req, res, next) {
  var token = req.header('Authorization', null);
  if(!token)
    return next(new restify.MissingParameterError('need token'));

  jwt.verify(token, secret, function(err,decoded) {
    if(err)
      return next(new restify.InvalidCredentialsError(err.message));

    User.findOne({id: decoded.id}, function(err, user) {
      next.ifError(err);

      if(!user)
        return next(new restify.InvalidCredentialsError('invalid id'));

      if(user.password !== decoded.password)
        return next(new restify.InvalidCredentialsError('expired password'));

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