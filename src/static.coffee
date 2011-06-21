http = require 'http' 
static = require 'node-static' 
util = require 'util' 
eventEmmitter = require('events').EventEmitter

fileServer = new static.Server './public'

staticFiles = []

Server = (host, port, files) ->
  this.host = host
  this.port = port
  staticFiles = files
  return
  
util.inherits(Server, eventEmmitter)

Server::create = ->
  self = this
  http.createServer((req, res) ->
    req.on('end', () ->
      fileServer.serve(req, res, (e, result) ->
        if e 
          self.emit('blad', req, res)
        else if isStatic req.url
          self.emit('static', req, res)
        else
          self.emit('dynamic', req, res)
        return
      )
      return
    )
    return
  ).listen(this.port, this.host)
  return
  
isStatic = (url) -> staticFiles.indexOf(url.substr(url.lastIndexOf('.') + 1)) > -1

exports.Server = Server