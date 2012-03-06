express = require("express")
routes = require("./routes")
geoip = require("geoip")
geolib = require("geolib")
zmq = require("zmq")
zmqsocket = zmq.socket("sub")
zmqsocket.connect "tcp://127.0.0.1:12777"
zmqsocket.subscribe ""
app = module.exports = express.createServer()
io = require("socket.io").listen(app)
io.sockets.on "connection", (socket) ->
  zmqsocket.on "message", (data) ->
    packet = JSON.parse(data)

  socket.on "mapmove", (mapcoords) ->
    console.log mapcoords

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
app.listen 3000
console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env

