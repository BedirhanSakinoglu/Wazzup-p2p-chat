const peer = new Peer();
var currentCall;
var nick;

peer.on("open", function (id) {
  document.getElementById("uuid").value = id;
});

window.onload = function() {
  if (sessionStorage.getItem("nickName")==null) {
    console.log("Nick not found");
    document.getElementById("initial").style.display = "block";
  }
  else {
    console.log("Nick found");
    nick = sessionStorage.getItem("nickName");
    document.getElementById("initial").style.display = "none";
    document.getElementById("menu").style.display = "block";
  }
};

function goOnline(){
  nick = document.getElementById("nickInput").value;
  if(nick===""){}
  else{
    sessionStorage.setItem("nickName", nick);
    document.getElementById("initial").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.getElementById("chat").style.display = "none";
  }
}

function changeNick(){
  sessionStorage.removeItem("nickName");
  location.reload();
}

async function callUser() {
  var peerId = document.getElementById("peerInput").value;
  if(peerId===""){}
  else{
    console.log("peerId: " + peerId);
    document.getElementById("menu").style.display = "none";
    document.getElementById("chat").style.display = "block";
    call = peer.connect(peerId);
    currentCall = call;
    call.on('open', function(data){
      call.on('data', function(data){
        console.log("Data content: " + data.content);
        insertMessageToDOM(data, false);
      });
      form = document.querySelector('form');
      form.addEventListener('submit', () => {
        inputArea = document.getElementById("messageText");
        input = document.getElementById("messageText").value;
        call.send({
          senderName: nick,
          content: input,
        });
        options = {
          content: input,
        }
        console.log("Options: " + options.content);
        insertMessageToDOM(options, true);
        inputArea.value = '';      
      });
      call.on('close', () => {
        endCall();
      })
    });
  }
}

peer.on("connection", function(call) {
  currentCall = call;
  document.getElementById("menu").style.display = "none";
  document.getElementById("chat").style.display = "block";
  call.on('open', function(data){
    call.on('data', function(data){
      console.log("Data content: " + data.content);
      insertMessageToDOM(data, false);
    });
    form = document.querySelector('form');
    form.addEventListener('submit', () => {
      inputArea = document.getElementById("messageText");
      input = document.getElementById("messageText").value;
        call.send({
          senderName: nick,
          content: input,
        });
        options = {
          content: input,
        }
        console.log("Options: " + options.content);
        insertMessageToDOM(options, true);
        inputArea.value = '';
    });
    call.on('close', () => {
      endCall();
    })
  });
});

function insertMessageToDOM(options, isFromMe) {
  console.log("Insert to DOM called: " + options.content)
  const template = document.querySelector('template[data-template="message"]');
  const nameEl = template.content.querySelector('.message__name');
  if(isFromMe){
    nameEl.innerText = nick;
  }
  else{
    nameEl.innerText = options.senderName;
  }

  template.content.querySelector('.message__bubble').innerText = options.content;
  const clone = document.importNode(template.content, true);
  const messageEl = clone.querySelector('.message');
  if (isFromMe) {
    messageEl.classList.add('message--mine');
  } else {
    messageEl.classList.add('message--theirs');
  }

  const messagesEl = document.querySelector('.messages');
  messagesEl.appendChild(clone);

  messagesEl.scrollTop = messagesEl.scrollHeight - messagesEl.clientHeight;
}

function endCall() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("chat").style.display = "none";
  if (!currentCall) return;
  try {
    currentCall.close();
  } catch {}
  currentCall = undefined;
  location.reload();
}

