var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var database = require(__dirname + '/app.js');

var connections = [];
app.set('port', (process.env.PORT || 5000));
server.listen(app.get('port'));
database.connect();
console.log('Node app is running on port', app.get('port'));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  console.log('Connection from: ' + request.connection.remoteAddress.split(",")[0]);
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool() + ' hihi');
});

app.get('/admin', function(request, response) {
  response.send('Please login.');
});

app.get('/room', function(request, response) {
  if (request.query.id) {
    database.find(request.query.room, request.query.id, function(result){
      if (result) response.render('pages/playroom', data=request.query);
      else response.sendFile(__dirname + '/views/static/404.html');
    });
  }
  else response.sendFile(__dirname + '/views/static/404.html');
});

app.use('*', function(req, res){
  res.sendFile(__dirname + '/views/static/404.html');
});

io.sockets.on('connection', function(socket) {
  connections.push(socket);
  var roomid, inroom = false;
  console.log('Current connections: %s sockets.', connections.length);

  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Current connections: %s sockets.', connections.length);
    if (roomid && inroom) {
      inroom = false;
      socket.broadcast.in(roomid).emit('left member');
      database.playerLeft(roomid);
    }
  });

  socket.on('add room', function(data) {
    if (data) database.insert(data);
    socket.emit('created');
  });

  socket.on('pick room', function(room) {
    if (room) {
      roomid = room;
      database.newplayer(roomid, socket.id);
      io.sockets.emit('redirect', "/room/?room=" + roomid + "&id=" + socket.id);
    }
  });

  socket.on('joined', function(room) { // from playroom page
    inroom = true;
    roomid = room;
		socket.join(room, function() {
      socket.broadcast.in(room).emit('new member');
  		socket.emit('joinsuccess');
    });
 	});
});
