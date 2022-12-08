const peer = new Peer();
var currentCall;
var message1 = "initial_1";
var message2 = "initial_2";
var isCaller;

peer.on("open", function (id) {
  document.getElementById("uuid").textContent = id;
});

async function callUser() {
  // get the id entered by the user
  const peerId = document.querySelector("input").value;
  // switch to the video call and play the camera preview
  document.getElementById("menu").style.display = "none";
  document.getElementById("chat").style.display = "block";
  // make the call
  isCaller = true;
  call = peer.connect(peerId);
  currentCall = call;
  call.on('open', function(data){
    call.on('data', function(data){
      console.log('Received ', data);
      insertMessageToDOM(data, false);
    });
    //call.send(message1);

    //-------------------------
    form = document.querySelector('form');
    form.addEventListener('submit', () => {
      input = document.getElementById("messageText").value;
      call.send(input);
      insertMessageToDOM(input, true);
    });
    //-------------------------
  });
}

peer.on("connection", function(call) {
  if (confirm(`Accept call from ${call.peer}?`)) {
    isCaller = false;
    currentCall = call;
    document.getElementById("menu").style.display = "none";
    document.getElementById("chat").style.display = "block";
    call.on('open', function(data){
      call.on('data', function(data){
        console.log('Received ', data);
        insertMessageToDOM(data, false);
      });
      
      //call.send(message2);

      //-------------------------
      form = document.querySelector('form');
      form.addEventListener('submit', () => {
        input = document.getElementById("messageText").value;
        call.send(input);
        insertMessageToDOM(input, true);
      });
    //-------------------------
    });
  } else {
    // user rejected the call, close it
    call.close();
  }
});

function insertMessageToDOM(options, isFromMe) {
  const template = document.querySelector('template[data-template="message"]');
  const nameEl = template.content.querySelector('.message__name');
  
  template.content.querySelector('.message__bubble').innerText = options;
  const clone = document.importNode(template.content, true);
  const messageEl = clone.querySelector('.message');
  if (isFromMe) {
    messageEl.classList.add('message--mine');
  } else {
    messageEl.classList.add('message--theirs');
  }

  const messagesEl = document.querySelector('.messages');
  messagesEl.appendChild(clone);

  // Scroll to bottom
  messagesEl.scrollTop = messagesEl.scrollHeight - messagesEl.clientHeight;
}

function endCall() {
  // Go back to the menu
  document.getElementById("menu").style.display = "block";
  document.getElementById("chat").style.display = "none";
  isCaller = false;
  // If there is no current call, return
  if (!currentCall) return;
  // Close the call, and reset the function
  try {
    currentCall.close();
  } catch {}
  currentCall = undefined;
}