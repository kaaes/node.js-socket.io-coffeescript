appsocket = () ->
  socket = new io.Socket('localhost', port: 8081)
  
  socket.on('message', (data) ->
    console.log('something poked me')
    console.dir(data)
    switch data.type
      when 'connect' then App.dom.showHelloMessage()
      when 'msg' then App.dom.appendToChat(data.msg)
      else 
        socket.disconnect()
        App.dom.appendToChat(data.msg)
    return
  )
 
  socket.on('connect', (data) ->
    console.log('connected to server, hell yeah');
    console.dir(data) #undefined - nothing sent here
    return
  )  
  
  socket.on('disconnect', (data) ->
    console.log('disonnected, blah')
    App.dom.clearChatSession()
  )
  
  _send : (msg) ->
    console.log('sending message... ' + msg)
    socket.send(msg)
    return
  send : socket.send.bind(socket)
  connect: socket.connect.bind(socket)
  connected : () -> socket.connected

@App or= {}
@App.socket = appsocket()