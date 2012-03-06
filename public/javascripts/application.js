jQuery(function() {
  var socket = io.connect('http://localhost');

  var map = new L.Map('aprs_map');
  var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/d7db25935f9246eb84b3f0847a86d081/997/256/{z}/{x}/{y}.png',
  	cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
  	cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});
    //map.setView(new L.LatLng(33.24617412, -96.42647853), 10).addLayer(cloudmade);
    map.locate({setView: true, maxZoom: 16}).addLayer(cloudmade);

    map.on('locationfound', function(e) {
        console.log(map.getBounds());
        socket.emit('mapmove', map.getBounds());
    });

    map.on('dragend', function(e) {
        //console.log(e);
        console.log(map.getBounds());
        socket.emit('mapmove', map.getBounds());
    });

  socket.on('packet', function (data) {
    //console.log(data);
    //$('#aprs_stream').append(data);
  
		var markerLocation = new L.LatLng(data.latitude, data.longitude),
			marker = new L.Marker(markerLocation);
		map.addLayer(marker);
		marker.bindPopup(data.srccallsign).openPopup();
  
  });


});
