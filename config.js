var fs = require('fs');

module.exports = (function() {
  console.log(process.env.MODE);
  var config = {};
  if(process.env.MODE == 'development' || !process.env.MODE) {
    config.db = 'mongodb://localhost/nodejs';
    config.ssl = {};
    config.ssl.certificate = fs.readFileSync('cert/certificate.pem', 'utf8');
    config.ssl.key = fs.readFileSync('cert/privatekey.pem', 'utf8');
    config.port = 443;
    config.bunyan = {};
    config.bunyan.req = {
      name: 'Nohu',
      streams: [{
        stream: process.stdout,
        level: 'debug'
      }]
    };
    config.bunyan.audit = {
      name: 'Audit',
      streams: [{
        //path: path.join(__dirname, 'audit.log')
        stream: process.stdout,
        level: 'debug'
      }]
    };
    config.throttle = {
      burst: 100,
      rate: 50,
      ip: true
    };
    config.tokenSecret = 'who am i';
  }
  else if(process.env.MODE == 'production') {
    config.db = 'mongodb://localhost/nodejs';
    config.ssl = {};
    config.ssl.certificate = fs.readFileSync('cert/certificate.pem', 'utf8');
    config.ssl.key = fs.readFileSync('cert/privatekey.pem', 'utf8');
    config.port = 443;
    config.bunyan = {};
    config.bunyan.req = {
      name: 'Nohu',
      streams: [{
        path: path.join(__dirname, 'nohu.log'),
        level: 'warn'
      }]
    };
    config.bunyan.audit = {
      name: 'Audit',
      streams: [{
        path: path.join(__dirname, 'audit.log'),
        level: 'warn'
      }]
    };
    config.throttle = {
      burst: 100,
      rate: 50,
      ip: true
    };
    config.tokenSecret = 'who am i';
  }
  else if(process.env.MODE == 'test') {
    config.db = 'mongodb://localhost/nohu-test';
    config.ssl = {};
    config.ssl.certificate = null;
    config.ssl.key = null;
    config.port = 3000;
    config.bunyan = {};
    config.bunyan.req = {
      name: 'Nohu',
      streams: [{
        stream: process.stdout,
        level: 'fatal'
      }]
    };
    config.bunyan.audit = {
      name: 'Audit',
      streams: [{
        //path: path.join(__dirname, 'audit.log')
        stream: process.stdout,
        level: 'fatal'
      }]
    };
    config.throttle = {
      burst: 0,
      rate: 0,
      ip: true
    };
    config.tokenSecret = 'who am i';
  }
  return config;
}());