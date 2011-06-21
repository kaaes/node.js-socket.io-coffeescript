(function() {
  var http, io, server, socket, statSrv, static;
  http = require('http');
  io = require('socket.io');
  static = require('../node_modules/static');
  statSrv = new static.Server('localhost', '8080', ['html', 'css', 'js']);
  statSrv.create();
  server = http.createServer(function(request, response) {
    response.end('hello world');
  });
  server.listen(8081);
  socket = io.listen(server);
  socket.on('connection', function(client) {
    console.log('connected');
    socket.broadcast({
      type: 'connect',
      msg: 'hi there new client'
    });
  });
  socket.on('clientMessage', function(msg, client) {
    console.log(msg);
    socket.broadcast({
      type: msg.type,
      msg: msg.msg
    });
  });
  statSrv.on('static', function(req, resp) {
    console.log('static --> ' + req.url);
  });
  statSrv.on('dynamic', function(req, resp) {
    console.log('dynamic --> ' + req.url);
  });
  statSrv.on('blad', function(req, resp) {
    console.log('blad --> ' + req.url);
  });
}).call(this);
