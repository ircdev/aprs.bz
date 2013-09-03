jQuery(function() {
//  var socket = io.connect('http://aprs.bz');
  var socket = io.connect('http://pair.ham.li:3000');

  var map = new L.Map('aprs_map');
  var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/d7db25935f9246eb84b3f0847a86d081/997/256/{z}/{x}/{y}.png',
    cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
    cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});
  map.setView(new L.LatLng(33, -96), 10).addLayer(cloudmade);
  map.locate({setView: true, maxZoom: 16}).addLayer(cloudmade);

  var BaseIcon = L.icon({
      iconUrl: '/images/house.png',
      shadowUrl: null,
      iconSize: new L.Point(32, 32),
      iconAnchor: new L.Point(16, 16),
      popupAnchor: new L.Point(0, 0)
  });
//  var houseIcon = new BaseIcon('/images/house.png');

var houseIcon = L.icon({
      iconUrl: '/images/house.png',                                 
      shadowUrl: null,                   
      iconSize: new L.Point(32, 32),
      iconAnchor: new L.Point(16, 16),
      popupAnchor: new L.Point(0, 0)
  }); 

  map.on('zoomend', function(e) {
      socket.emit('mapmove', map.getBounds());
  });

  map.on('locationfound', function(e) {
      socket.emit('mapmove', map.getBounds());
  });

  map.on('dragend', function(e) {
      socket.emit('mapmove', map.getBounds());
  });

  socket.on('packet', function (data) {
   var markerLocation = new L.LatLng(data.latitude, data.longitude);
    console.log(data);
      //var iconType = selectIcon(data.symbolcode);
    var marker = new L.Marker(markerLocation, {icon: houseIcon});
    map.addLayer(marker);
    popupText = data.srccallsign;
    if (data.comment != undefined) { popupText = popupText + "<br>" + data.comment; }
    marker.bindPopup(popupText).openPopup();
  });

});
