var User = require('../models').User;
var jwt = require('jsonwebtoken');
var secret = 'who am i';

module.exports.authorization = function(req, res, next) {
  var token = req.header('Authorization', null);
  if(!token) {
    res.send(401, {message: 'unauthenticated'});
    return next();
  }
  jwt.verify(token, secret, function(err,decoded) {
    if(err) {
      res.send(401, err);
      return next();
    }

    User.findOne({id: decoded.id}, function(err, user) {
      if(err)
        return(err);

      if(!user) {
        res.send(401, {message: 'invalid id'})
        return next();
      }

      if(user.password !== decoded.password) {
        res.send(401, {message: 'expired password'});
        return next();
      }

      req.user = user;
      return next();
    });
  });
};

module.exports.generateToken = function(user) {
  return jwt.sign({id: user.id, password: user.password}, secret, {
    expiresInMinutes: 5
  });  
};