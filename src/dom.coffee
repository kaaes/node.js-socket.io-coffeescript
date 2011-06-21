appdom = ->
  d = document;
  messageInput = d.getElementById('msgInput')
  container = d.getElementById('cont')
  chatWindow = d.getElementById('chat')
  hint = d.getElementById('hint')
  
  fillHint = ->
    hint.innerHTML = if App.socket.connected() then 'Type message here or press esc to finish' else 'To start give your name and hit enter'
  
  sendMessage = (msg, type) ->
    App.socket.send(
      type : type or 'msg',
      msg : msg
    )
    messageInput.value = ''
    return 
  
  appendToChat = (msg) ->
    p = d.createElement('p');
    p.innerHTML = msg;
    chatWindow.appendChild(p);
    chatWindow.scrollTop = chatWindow.scrollHeight
    fillHint()
    return
  
  userName = null
  fillHint()

  messageInput.addEventListener('keyup', (e) ->
    if e.keyCode is 27 and App.socket.connected()
      sendMessage('--- Disconnecting <span class="user-name">' + userName + '</span>&hellip; ---', 'disconnect')
      container.className = 'disconnected'
    else if e.keyCode is 13
      if App.socket.connected()
        sendMessage('<span class="user-name">' + userName + ':</span> ' + messageInput.value)
      else
        appendToChat('--- Connecting, please wait ---')
        messageInput.disabled = true
        App.socket.connect()
        container.className = 'connected'
    return
  )
  
  return appendToChat : appendToChat
  showHelloMessage : ->
    userName = messageInput.value
    sendMessage('--- Hello <span class="user-name">' + userName + '</span>! ---')
    messageInput.disabled = false
    return
  clearChatSession : ->
    userName = null
    appendToChat('--- You are disconnected ---')
    return

this.App or= {}
this.App.dom = appdom()