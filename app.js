var express = require('express')
  , routes = require('./routes')
  , geoip = require('geoip')
  , geolib = require('geolib')

var zmq = require('zmq')
  , zmqsocket = zmq.socket('sub')

zmqsocket.connect('tcp://stream.aprs.bz:12777')
zmqsocket.subscribe("")

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app)


io.sockets.on('connection', function (socket) {
  zmqsocket.on('message', function(data) {
    var packet = JSON.parse(data)
  });

  socket.on('mapmove', function (mapcoords) {
    console.log(mapcoords)
/*
    if (packet.latitude != null && packet.longitude != null)
    {
      var inDistance = geolib.isPointInCircle({latitude: packet.latitude, longitude: packet.longitude}, {latitude: 33.24617412, longitude: -96.42647853}, 50000);
      if (inDistance)
      {
        io.sockets.emit('packet', packet);
        console.log("received data: " + packet.toString('utf8'));
      }
    }
*/
  })

})

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
  app.use(express.errorHandler())
})

// Routes
app.get('/', routes.index)

// WE'LL DO IT LIVE
app.listen(3000)

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env)

