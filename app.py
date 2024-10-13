from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Predefined servers
SERVERS = ['irc.server1.com', 'irc.server2.net', 'irc.hackernet.org']

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']
        server = request.form['server']
        if not username or not server:
            return redirect(url_for('index'))
        return render_template('chat.html', username=username, server=server)
    return render_template('index.html', servers=SERVERS)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['server']
    join_room(room)
    emit('message', {'msg': f'{username} has joined the chat'}, room=room)

@socketio.on('message')
def handle_message(data):
    emit('message', {'msg': f"{data['username']}: {data['msg']}"}, room=data['server'])

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['server']
    leave_room(room)
    emit('message', {'msg': f'{username} has left the chat'}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
