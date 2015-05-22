var restify = require('restify');
var routes = require('./routes');
var logger = require('morgan');
var fs = require('fs');

var certificate = fs.readFileSync('cert/certificate.pem', 'utf8');
var key = fs.readFileSync('cert/privatekey.pem', 'utf8');

var server = restify.createServer({
  certificate: certificate,
  key: key,
  name: 'Nohu'
});
server.use(logger('dev'));
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

routes(server);

server.get('/', function(req, res, next) {
  res.send('nohunohu~');
  return next();
});

server.listen(443, function() {
  console.log('%s listening at %s', server.name, server.url);
});