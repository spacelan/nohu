var User = require('../models').User;
var _ = require('lodash');
var validator = require('validator');
var auth = require('../middlewares/auth.js');

module.exports = function(server) {
  server.post('/login', function(req, res, next) {
    User.findOne({phone: req.params.phone}, function(err, user) {
      if(err)
        return next(err);

      if(!user) {
        res.send(422, {message: 'invalid mobile phone or password'});
        return next();
      }

      if(!user.validPassword(req.params.password)) {
        res.send(422, {message: 'invalid mobile phone or password'});
        return next();
      }
      
      res.send({token: auth.generateToken(user)});
    });
  });


  server.post('/signup', function(req, res, next) {
    var phone = validator.trim(req.params.phone);
    var password = req.params.password;
    if(!validator.isMobilePhone(phone, 'zh-CN')) {
      res.send(422, {message: 'invalid mobile phone'});
      return next();
    }

    User.findOne({phone: phone}, function(err, user) {
      if(err)
        return next(err);

      if(user) {
        res.send(422, {message: 'registed mobile phone'});
        return next();
      }

      var newUser = new User();
      newUser.phone = phone;
      newUser.password = newUser.hashPassword(password);
      console.log('hashPassword');
      newUser.save(function(err) {
        if(err)
          return next(err);

        res.send({token: auth.generateToken(newUser)});
      });
    });
  });

  server.get('/users', auth.authorization, function(req, res, next) {
    User.find(function(err, users) {
      if(err)
        return next(err);

      res.send(users);
      return next();
    });
  });

  server.get('/users/:id', auth.authorization, function(req, res, next) {
    var id = _.trim(req.params.id);
    User.findOne({id: id}, function(err, user) {
      if(err)
        return next(err);

      if(!user) {
        res.send(404, {message: 'this user dose not exist'});
        return next();
      }

      res.send(_.pick(user, ['id', 'email', 'phone', 'create_date']));
      return next();
    });
  });

  server.put('/users', auth.authorization, function(req, res, next) {
    var user = req.user;
    _.assign(user, req.params);
    user.save(function(err) {
      if(err)
        return next(err);

      res.send(user);
      return next();
    });
  });
};
