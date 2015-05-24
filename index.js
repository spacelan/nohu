var restify = require('restify');
var routes = require('./routes');
var logger = require('morgan');
var bunyan = require('bunyan');
var path = require('path');
var config = require('./config.js');

var server = restify.createServer({
  certificate: config.ssl.certificate,
  key: config.ssl.key,
  name: 'Nohu',
  log: bunyan.createLogger(config.bunyan.req)
});
//server.use(logger('dev'));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.requestLogger());
server.use(restify.throttle(config.throttle));
server.on('after', restify.auditLogger({
  log: bunyan.createLogger(config.bunyan.audit)
}));

routes(server);

server.get('/', function(req, res, next) {
  req.log.debug('hello guys! This is Nohu~');
  res.send('hello guys! This is Nohu~');
  return next();
});

module.exports = server;

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
