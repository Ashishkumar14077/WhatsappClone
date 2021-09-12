const socket = io('http://localhost:8000');

const form = document.getElementById('type-message-bar')
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.chat-window');

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'sender');
    socket.emit('send', message);
    messageInput.value = "";
})

const Name = prompt("enter your name to join");
socket.emit('new-user-joined', Name);

socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'receiver');
})

socket.on('send', data =>{
    append(`${data.message}: ${data.user}`, 'receiver');
})