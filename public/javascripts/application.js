var socket = io.connect('http://localhost');
socket.on('packet', function (data) {
  //console.log(data);
  $('#aprs_stream').append(data);
});
