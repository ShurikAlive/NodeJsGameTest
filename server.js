var PORT = process.env.PORT || 5000;

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/views/index.html'));
});

// Запуск сервера
server.listen(PORT, function() {
    console.log('Start server in port = ' + PORT);
});

var players = {};

io.on('connection', function(socket) {
	
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
  
  socket.on('disconnect', function () {
    delete players[socket.id];
  });
});

var lastUpdateTime = (new Date()).getTime();

setInterval(function() {
  // код ...
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;
  //player.x += 5 * timeDifference;
  
  io.sockets.emit('state', players);
  
  lastUpdateTime = currentTime;
}, 1000 / 60);
