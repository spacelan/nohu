var restify = require('restify');
var User = require('../models').User;
var _ = require('lodash');
var validator = require('validator');
var auth = require('../middlewares/auth.js');

module.exports = function(server) {
  server.post('/login', function(req, res, next) {
    User.findOne({phone: req.params.phone}, function(err, user) {
      next.ifError(err);

      if(!user || !user.validPassword(req.params.password))
        return next(new restify.UnprocessableEntityError('invalid mobile phone or password'));

      res.send(auth.generateToken(user));
      return next();
    });
  });

  server.post('/signup', function(req, res, next) {
    var phone = validator.trim(req.params.phone);
    var password = req.params.password;

    if(!validator.isMobilePhone(phone, 'zh-CN'))
      return next(new restify.UnprocessableEntityError('invalid mobile phone'));

    User.findOne({phone: phone}, function(err, user) {
      next.ifError(err);

      if(user)
        return next(new restify.UnprocessableEntityError('registed mobile phone'));

      if(password.length < 6 || password.length > 20 || password.indexOf(' ') !== -1)
        return next(new restify.UnprocessableEntityError('password too short or too long. 6 <= password.length <= 20'));

      var newUser = new User();
      newUser.phone = phone;
      newUser.password = newUser.hashPassword(password);

      newUser.save(function(err) {
        next.ifError(err);

        res.send(201, auth.generateToken(newUser));
        return next();
      });
    });
  });

  server.get('/token', auth.authorization, function(req, res, next) {
    var user = req.user;

    res.send(auth.generateToken(user));
    return next();
  });

  server.post('/password', auth.authorization, function(req, res, next) {
    var user = req.user;
    var password = req.params.password;
    var newPassword = req.params.newPassword;

    if(!user.validPassword(password))
      return next(new restify.UnprocessableEntityError('invalid password'));

    if(newPassword.length < 6 || newPassword.length > 20 || newPassword.indexOf(' ') !== -1)
      return next(new restify.UnprocessableEntityError('invalid newPassword'));

    user.password = user.hashPassword(newPassword);
    user.save(function(err) {
      next.ifError(err);

      res.send(201, auth.generateToken(user));
      return next();
    });
  });

  server.get('/users', auth.authorization, function(req, res, next) {
    User.find(function(err, users) {
      next.ifError(err);

      res.send(users);
      return next();
    });
  });

  server.get('/users/:id', auth.authorization, function(req, res, next) {
    var id = _.trim(req.params.id);

    User.findOne({id: id}, function(err, user) {
      next.ifError(err);

      if(!user)
        return next(new restify.ResourceNotFoundError('this user dose not exist'));

      res.send(user);
      return next();
    });
  });

  server.put('/users', auth.authorization, function(req, res, next) {
    var user = req.user;

    _.assign(user, req.params);
    user.save(function(err) {
      next.ifError(err);

      res.send(201, user);
      return next();
    });
  });
};
