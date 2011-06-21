(function() {
  var appsocket;
  appsocket = function() {
    var socket;
    socket = new io.Socket('localhost', {
      port: 8081
    });
    socket.on('message', function(data) {
      console.log('something poked me');
      console.dir(data);
      switch (data.type) {
        case 'connect':
          App.dom.showHelloMessage();
          break;
        case 'msg':
          App.dom.appendToChat(data.msg);
          break;
        default:
          socket.disconnect();
          App.dom.appendToChat(data.msg);
      }
    });
    socket.on('connect', function(data) {
      console.log('connected to server, hell yeah');
      console.dir(data);
    });
    socket.on('disconnect', function(data) {
      console.log('disonnected, blah');
      return App.dom.clearChatSession();
    });
    return {
      _send: function(msg) {
        console.log('sending message... ' + msg);
        socket.send(msg);
      },
      send: socket.send.bind(socket),
      connect: socket.connect.bind(socket),
      connected: function() {
        return socket.connected;
      }
    };
  };
  this.App || (this.App = {});
  this.App.socket = appsocket();
}).call(this);
