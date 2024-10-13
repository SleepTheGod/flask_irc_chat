// Connect to the WebSocket via Socket.IO
const socket = io();

// Grab the username and server information passed from the server-side template
const username = document.getElementById('username').value;
const server = document.getElementById('server').value;

// Join the chatroom (server) when the page loads
socket.emit('join', { username: username, server: server });

// Listen for messages from the server and display them in the chat box
socket.on('message', function (data) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('p');
    messageElement.textContent = data.msg;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
});

// Send the message to the server
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (message.trim()) {  // Ensure non-empty messages
        socket.emit('message', { username: username, msg: message, server: server });
        messageInput.value = '';  // Clear the input field after sending
    }
}

// Handle the 'Enter' key press to send a message
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Notify the server when the user leaves the chat
window.addEventListener('beforeunload', function () {
    socket.emit('leave', { username: username, server: server });
});

