(function() {
  var appdom;
  appdom = function() {
    var appendToChat, chatWindow, container, d, fillHint, hint, messageInput, sendMessage, userName;
    d = document;
    messageInput = d.getElementById('msgInput');
    container = d.getElementById('cont');
    chatWindow = d.getElementById('chat');
    hint = d.getElementById('hint');
    fillHint = function() {
      return hint.innerHTML = App.socket.connected() ? 'Type message here or press esc to finish' : 'To start give your name and hit enter';
    };
    sendMessage = function(msg, type) {
      App.socket.send({
        type: type || 'msg',
        msg: msg
      });
      messageInput.value = '';
    };
    appendToChat = function(msg) {
      var p;
      p = d.createElement('p');
      p.innerHTML = msg;
      chatWindow.appendChild(p);
      chatWindow.scrollTop = chatWindow.scrollHeight;
      fillHint();
    };
    userName = null;
    fillHint();
    messageInput.addEventListener('keyup', function(e) {
      if (e.keyCode === 27 && App.socket.connected()) {
        sendMessage('--- Disconnecting <span class="user-name">' + userName + '</span>&hellip; ---', 'disconnect');
        container.className = 'disconnected';
      } else if (e.keyCode === 13) {
        if (App.socket.connected()) {
          sendMessage('<span class="user-name">' + userName + ':</span> ' + messageInput.value);
        } else {
          appendToChat('--- Connecting, please wait ---');
          messageInput.disabled = true;
          App.socket.connect();
          container.className = 'connected';
        }
      }
    });
    return {
      appendToChat: appendToChat,
      showHelloMessage: function() {
        userName = messageInput.value;
        sendMessage('--- Hello <span class="user-name">' + userName + '</span>! ---');
        messageInput.disabled = false;
      },
      clearChatSession: function() {
        userName = null;
        appendToChat('--- You are disconnected ---');
      }
    };
  };
  this.App || (this.App = {});
  this.App.dom = appdom();
}).call(this);
