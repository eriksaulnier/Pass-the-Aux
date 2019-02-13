import io from 'socket.io-client';

const socket = io.connect(process.env.REACT_APP_SERVER_IP);

function subscribeToMessages(cb) {
    socket.on('message', (user, message) => cb(`${user}: ${message}`));
}

export { socket, subscribeToMessages }; 