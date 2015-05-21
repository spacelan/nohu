var restify = require('restify');
var routes = require('./routes');
var logger = require('morgan');

var server = restify.createServer();
server.use(logger('dev'));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

routes(server);

server.listen(3000, function() {
  console.log('%s listening at %s', server.name, server.url);
});