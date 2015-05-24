var restify = require('restify');
var User = require('../models').User;
var _ = require('lodash');
var validator = require('validator');
var auth = require('../middlewares/auth.js');

module.exports = function(server) {
  server.post('/login', function(req, res, next) {
    var phone = _.trim(req.params.phone);
    var password = _.trim(req.params.password);
    req.log.debug('phone=' + phone + ' password=' + password);
    var errMsg;
    if(phone == '')
      errMsg = 'no phone';
    else if(password == '')
      errMsg = 'no password';
    if(errMsg)
      return next(new restify.MissingParameterError(errMsg));

    User.findOne({phone: req.params.phone}, function(err, user) {
      next.ifError(err);

      if(!user || !user.validPassword(req.params.password))
        return next(new restify.UnprocessableEntityError('invalid mobile phone or password'));

      res.send(auth.generateToken(user));
      return next();
    });
  });

  server.post('/signup', function(req, res, next) {
    var phone = _.trim(req.params.phone);
    var password = _.trim(req.params.password);
    req.log.debug('phone=' + phone + ' password=' + password);
    var errMsg;
    if(phone == '')
      errMsg = 'no phone';
    else if(password == '')
      errMsg = 'no password';
    if(errMsg)
      return next(new restify.MissingParameterError(errMsg));

    errMsg = '';
    if(!validator.isMobilePhone(phone, 'zh-CN'))
      errMsg = 'invalid mobile phone';
    else if(password.length < 6 || password.length > 20)
      errMsg = 'password too short or too long. 6 <= password.length <= 20'
    if(errMsg)
      return next(new restify.UnprocessableEntityError(errMsg));

    User.findOne({phone: phone}, function(err, user) {
      next.ifError(err);

      if(user)
        return next(new restify.UnprocessableEntityError('registed mobile phone'));

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
    var password = _.trim(req.params.password);
    var newPassword = _.trim(req.params.newPassword);
    req.log.debug('newPassword=' + newPassword + ' password=' + password);
    var errMsg;
    if(!user.validPassword(password))
      errMsg = 'invalid password';
    else if(newPassword.length < 6 || newPassword.length > 20)
      errMsg = 'invalid newPassword';
    if(errMsg)
      return next(new restify.UnprocessableEntityError(errMsg));

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

    if(id == 'me' || id == req.user.id) {
      res.send(req.user);
      return next();
    }

    User.findOne({id: id}, function(err, user) {
      next.ifError(err);

      if(!user)
        return next(new restify.ResourceNotFoundError('this user dose not exist'));

      res.send(user);
      return next();
    });
  });

  server.put('/users/:id', auth.authorization, function(req, res, next) {
    var user = req.user;
    var id = _.trim(req.params.id);
    var params = req.params;

    req.log.debug(id);
    if(user.id !== id && id !== 'me')
      return next(new restify.NotAuthorizedError('should not change other users\' data'));

    var profile = {};
    if(validator.isEmail(params.email) || params.email == '')
      profile.email = params.email;
    if(validator.isURL(params.avater_url) || params.avater_url == '')
      profile.avater_url = params.avater_url;
    if(_.inRange(params.age, 0, 200))
      profile.age = params.age;
    if(params.gender == 'male' || params.gender == 'female' || params.gender == '')
      profile.gender = params.gender;
    if(validator.isLength(params.introduction, 0, 800) && params.introduction)
      profile.introduction = params.introduction;
    if(validator.isLength(params.display_name, 0, 20) && params.display_name)
      profile.display_name = params.display_name;
    req.log.debug(profile);

    /*var errMsg;
    if(params.email && !validator.isEmail(params.email))
      errMsg = 'invalid email';
    else if(params.avater_url && !validator.isURL(params.avater_url))
      errMsg = 'invalid avater url';
    else if(params.age && (params.age < 0 || params.age > 200))
      errMsg = 'invalid age. should: 0 <= age <= 200';
    if(errMsg)
      return next(new restify.UnprocessableEntityError(errMsg));
    params = _.pick(params, ['email', 'age', 'gender', 'introduction', 'display_name', 'avater_url']);
    req.log.debug(params);*/

    _.assign(user, profile);
    user.save(function(err) {
      next.ifError(err);

      res.send(201, user);
      return next();
    });
  });
};
