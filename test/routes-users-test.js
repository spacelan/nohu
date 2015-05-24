var server = require('../index.js');
var supertest = require('supertest');
var should = require('should');
var eventproxy = require('eventproxy');

var request = supertest(server);

describe('tests/routes-users-test.js', function() {
  var token;
  before(function(done) {
    var User = require('../models').User;
    User.remove({phone: '18000000000'}, done);
  });

  after(function(done) {
    var User = require('../models').User;
    User.remove({phone: '18000000000'}, done);
  });

  describe('/', function() {
    it('should return 200 when get', function(done) {
      request.get('/')
      .expect(200, function(err, res) {
        res.text.should.containEql('hello');
        done(err);
      });
    });
  });

  describe('/signup', function() {
    it('should return 201 when post with valid unregisted phone and password', function(done) {
      request.post('/signup')
      .send({
        phone: '18000000000',
        password: '100000'
      })
      .expect(201, function(err, res) {
        res.text.should.containEql('token');
        done(err);
      });
    });

    it('should return 422 then post with invalid phone or password', function(done) {
      var ep = new eventproxy;
      ep.fail(done);
      ep.all('phone', 'password too short', 'password too long', done);

      request.post('/signup')
      .send({
        phone: '66666666666',
        password: '100000'
      })
      .expect(422, ep.done('phone', function(res) {
        res.text.should.containEql('phone');
        return;
      }));

      request.post('/signup')
      .send({
        phone: '18000000000',
        password: '0'
      })
      .expect(422, ep.done('password too short', function(res) {
        res.text.should.containEql('short');
        return;
      }));

      request.post('/signup')
      .send({
        phone: '18000000000',
        password: '012345678901324567980123456798'
      })
      .expect(422, ep.done('password too long', function(res) {
        res.text.should.containEql('long');
        return;
      }));
    });

    it('should return 422 then post with registed phone and password', function(done) {
      request.post('/signup')
      .send({
        phone: '18000000000',
        password: '100000'
      })
      .expect(422, function(err, res) {
        res.text.should.containEql('registed');
        done(err);
      });
    });

    it('should return 409 when post with no phone or password', function(done) {
      var ep = new eventproxy;
      ep.fail(done);
      ep.all('password', 'phone', done);

      request.post('/signup')
      .send({
        password: '666666'
      })
      .expect(409, ep.done('phone', function(res) {
        res.text.should.containEql('phone');
        return;
      }));

      request.post('/signup')
      .send({
        phone: '18000000000'
      })
      .expect(409, ep.done('password', function(res) {
        res.text.should.containEql('password');
        return;
      }));
    });

    it('should return 405 when get', function(done) {
      request.get('/signup')
      .expect(405, function(err, res) {
        done(err);
      });
    });
  });

  describe('/login', function() {
    it('should return 200 when post with registed phone and password', function(done) {
      request.post('/login')
      .send({
        phone: '18000000000',
        password: '100000'
      })
      .expect(200, function(err, res) {
        res.text.should.containEql('token');
        token = JSON.parse(res.text).token;
        done(err);
      });
    });

    it('should return 422 when post with unregisted phone or wrong password', function(done) {
      var ep = new eventproxy;
      ep.fail(done);
      ep.all('phone', 'password', done);

      request.post('/login')
      .send({
        phone: '18100000000',
        password: '100000'
      })
      .expect(422, ep.done('phone', function(res) {
        res.text.should.containEql('phone');
        return;
      }));

      request.post('/login')
      .send({
        phone: '18000000000',
        password: '10000000'
      })
      .expect(422, ep.done('password', function(res) {
        res.text.should.containEql('password');
        return;
      }));
    });

    it('should return 409 when post with no phone or password', function(done) {
      var ep = new eventproxy;
      ep.fail(done);
      ep.all('password', 'phone', done);

      request.post('/login')
      .send({
        password: '100000'
      })
      .expect(409, ep.done('phone', function(res) {
        res.text.should.containEql('phone');
        return;
      }));

      request.post('/login')
      .send({
        phone: '18000000000'
      })
      .expect(409, ep.done('password', function(res) {
        res.text.should.containEql('password');
        return;
      }));
    });

    it('should return 405 when get', function(done) {
      request.get('/login')
      .expect(405, function(err, res) {
        done(err);
      });
    });
  });

  describe('/token', function(){
    it('should return 200 when get with valid token', function(done) {
      request.get('/token')
      .set('Authorization', token)
      .expect(200, function(err, res) {
        res.text.should.containEql('token');
        token = JSON.parse(res.text).token;
        done(err);
      });
    });

    it('should return 401 when get with invalid token', function(done) {
      request.get('/token')
      .set('Authorization', 'invalid token')
      .expect(401, function(err, res) {
        done(err);
      });
    });

    it('should return 401 when get with expired password token', function(done) {
      request.post('/password')
      .set('Authorization', token)
      .send({
        password: '100000',
        newPassword: '666666'
      })
      .expect(201, function(err, res) {
        var oldToken = token;
        res.text.should.containEql('token');
        token = JSON.parse(res.text).token;
        
        request.get('/token')
        .set('Authorization', oldToken)
        .expect(401, function(err, res) {
          res.text.should.containEql('password');
          done(err);
        });
      });
    })

    it('should return 409 when get with no token', function(done) {
      request.get('/token')
      .expect(409, function(err, res) {
        done(err);
      });
    });
  });

  describe('/password', function() {
    it('should return 201 when post with valid token and right password and valid new password', function(done) {
      request.post('/password')
      .set('Authorization', token)
      .send({
        password: '666666',
        newPassword: '100000'
      })
      .expect(201, function(err, res) {
        res.text.should.containEql('token');
        token = JSON.parse(res.text).token;
        done(err);
      });
    });

    it('should return 401 when post with invalid token', function(done) {
      request.post('/password')
      .set('Authorization', 'invalid token')
      .expect(401, function(err, res) {
        done(err);
      });
    });

    it('should return 409 when post with no token', function(done) {
      request.post('/password')
      .expect(409, function(err, res) {
        done(err);
      });
    });
  });

  describe('/users', function() {
    it('should return 200 when get with registed id', function(done) {
      request.get('/users/me')
      .set('Authorization', token)
      .expect(200, function(err, res) {
        res.text.should.containEql('id');
        done(err);
      });
    });

    it('should return 201 when put with valid data', function(done) {
      request.put('/users/me')
      .set('Authorization', token)
      .send({
        age: 20,
        introduction: 'i am in',
        fakeData: 'hehe'
      })
      .expect(201, function(err, res) {
        var json = JSON.parse(res.text);
        should(json).have.property('age', 20);
        should(json).have.property('introduction', 'i am in');
        should(json).not.have.property('fakeData');
        done(err);
      });
    });

    it('should return 403 when put with other\'s user id', function(done) {
      request.put('/users/other')
      .set('Authorization', token)
      .send({
        age: 20
      })
      .expect(403, function(err, res) {
        res.text.should.containEql('other');
        done(err);
      });
    });
  });
});