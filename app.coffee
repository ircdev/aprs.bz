express = require("express")
routes = require("./routes")
geolib = require("geolib")
zmq = require("zmq")
zmqsocket = zmq.socket("sub")

zmqsocket.connect "tcp://stream.aprs.bz:12777"
zmqsocket.subscribe ""
app = module.exports = express.createServer()
io = require("socket.io").listen(app)

mapbounds = ""

io.sockets.on "connection", (socket) ->
  #console.log socket
  socket.on "mapmove", (mapcoords) ->
    console.log mapbounds
    mapbounds = mapcoords

zmqsocket.on "message", (data) ->
  packet = JSON.parse(data)
  #console.log packet

  if packet.latitude? and packet.longitude? and (mapbounds != "")
    insideMap = geolib.isPointInside
      latitude: packet.latitude
      longitude: packet.longitude
    , [
      latitude: mapbounds._northEast.lat
      longitude: mapbounds._southWest.lng
    ,
      latitude: mapbounds._northEast.lat
      longitude: mapbounds._northEast.lng
    ,
      latitude: mapbounds._southWest.lat
      longitude: mapbounds._northEast.lng
    ,
      latitude: mapbounds._southWest.lat
      longitude: mapbounds._southWest.lng
    ]
    if insideMap
      console.log "\n--------------------------------------------------------\n"
      io.sockets.emit "packet", packet
      console.log packet

app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

app.get "/", routes.index
if app.settings.env == "development"
  app.listen 3000
else
  app.listen 80

console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env

