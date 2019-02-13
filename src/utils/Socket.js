import io from 'socket.io-client';

const socket = io.connect(':8000');

function subscribeToMessages(cb) {
    socket.on('message', (user, message) => cb(`${user}: ${message}`));
}

export { socket, subscribeToMessages }; 