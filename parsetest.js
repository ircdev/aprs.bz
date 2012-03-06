var geoip = require('geoip')
  , geolib = require('geolib');

var zmq = require('zmq')
  , zmqsocket = zmq.socket('sub');

zmqsocket.connect('tcp://127.0.0.1:12777');
zmqsocket.subscribe("");

zmqsocket.on('message', function(data) {
  
//  console.log("received data: " + data.toString('utf8'));
  var packet = JSON.parse(data);
//  console.log("received data: " + packet.latitude);
  //console.log("received data: " + packet.longitude);

//  geolib.isPointInCircle({latitude: 51.525, longitude: 7.4575}, {latitude: 51.5175, longitude: 7.4678}, 5000);
  if (packet.latitude != null && packet.longitude != null)
  {
    var inDistance = geolib.isPointInCircle({latitude: packet.latitude, longitude: packet.longitude}, {latitude: 33.24617412, longitude: -96.42647853}, 50000);
    if (inDistance)
    {
      console.log("received data: " + data.toString('utf8'));
    }
  }

});


/*
var City = geoip.City;
var city = new City('./GeoLiteCity.dat');
var user_location = city.lookupSync(request.connection.remoteAddress);
console.log(user_location);
*/
