(function() {
  var Server, eventEmmitter, fileServer, http, isStatic, static, staticFiles, util;
  http = require('http');
  static = require('node-static');
  util = require('util');
  eventEmmitter = require('events').EventEmitter;
  fileServer = new static.Server('./public');
  staticFiles = [];
  Server = function(host, port, files) {
    this.host = host;
    this.port = port;
    staticFiles = files;
  };
  util.inherits(Server, eventEmmitter);
  Server.prototype.create = function() {
    var self;
    self = this;
    http.createServer(function(req, res) {
      req.on('end', function() {
        fileServer.serve(req, res, function(e, result) {
          if (e) {
            self.emit('blad', req, res);
          } else if (isStatic(req.url)) {
            self.emit('static', req, res);
          } else {
            self.emit('dynamic', req, res);
          }
        });
      });
    }).listen(this.port, this.host);
  };
  isStatic = function(url) {
    return staticFiles.indexOf(url.substr(url.lastIndexOf('.') + 1)) > -1;
  };
  exports.Server = Server;
}).call(this);
