let username = "";
const socket = new WebSocket(`ws://${window.location.host}`);

const nameScreen = document.getElementById("nameScreen");
const chatScreen = document.getElementById("chatScreen");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");

function joinChat() {
  const input = document.getElementById("username").value.trim();
  if (!input) return;

  username = input;
  nameScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `<span class="name">${data.name}:</span> ${data.text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

function sendMessage() {
  if (!messageInput.value.trim()) return;

  socket.send(JSON.stringify({
    name: username,
    text: messageInput.value
  }));

  messageInput.value = "";
}
