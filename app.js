var express = require('express')
  , routes = require('./routes')
  , geoip = require('geoip');

var zmq = require('zmq')
  , zmqsocket = zmq.socket('sub');

zmqsocket.connect('tcp://127.0.0.1:12777');
zmqsocket.subscribe("");

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
  zmqsocket.on('message', function(data) {
    console.log("received data: " + data.toString('utf8'));
    io.sockets.emit('packet', data.toString('utf8'));
  });
});


var City = geoip.City;
var city = new City('./GeoLiteCity.dat');
var user_location = city.lookupSync(request.connection.remoteAddress);
console.log(user_location);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

// WE'LL DO IT LIVE

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
