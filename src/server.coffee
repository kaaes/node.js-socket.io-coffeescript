http = require('http')
io = require('socket.io')
static = require '../node_modules/static'

statSrv = new static.Server('localhost', '8080', ['html', 'css', 'js'])
statSrv.create()

server = http.createServer((request, response) -> 
  #response.writeHead(200, 'Content-Type': 'text/html')
  response.end 'hello world' 
  return
)
server.listen 8081

# sockets logic
socket = io.listen(server)

socket.on('connection', (client) ->
  console.log 'connected' 
  socket.broadcast {type : 'connect', msg : 'hi there new client'}
  return
)

socket.on('clientMessage', (msg, client) ->
  console.log msg
  socket.broadcast 
    type : msg.type 
    msg : msg.msg
  return
)

#static server logic

statSrv.on('static', (req, resp) ->
	console.log('static --> ' + req.url)
	return
)

statSrv.on('dynamic', (req, resp) ->
	console.log('dynamic --> ' + req.url)
	return
)

statSrv.on('blad', (req, resp) ->
	console.log('blad --> ' + req.url)
	return
)
