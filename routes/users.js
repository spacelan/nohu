var User = require('../models').User;

module.exports = function(server) {
  server.get('/users', function(req, res, next) {
    res.send('get users');
  });
  server.post('/users', function(req, res, next) {
    var params = req.params;
    console.log(params);
    var user = new User();
    if(params.hasOwnProperty('username'))
      user.username = params.username;
    if(params.hasOwnProperty('password'))
      user.password = params.password;
    if(params.hasOwnProperty('email'))
      user.email = params.email;
    user.save(function(err) {
      if(err) {
        return next(err);
      }
      else {
        res.send('OK');
        return next();
      }
    });
  });
  server.put('/users/:id', function(req, res, next) {
    console.log(req.params);
    res.send('update the specific user');
  });
  server.del('/users/:id', function(req, res, next) {
    res.send('delete the specific user');
  });
};