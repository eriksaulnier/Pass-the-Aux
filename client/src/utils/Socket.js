import io from 'socket.io-client';

const socket = io.connect();

function subscribeToMessages(cb) {
    socket.on('message', (user, message) => cb(`${user}: ${message}`));
}

export { socket, subscribeToMessages }; 