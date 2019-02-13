
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

if (process.env.NODE_ENV !== 'production') {
    io.origins('*:*');
}

const port = process.env.PORT || 8000;

http.listen(port, function() {
    console.log(`Listening on port ${port}`)
});

// all active rooms
let rooms = [];

io.on('connection', function(socket) {
    console.log(`user ${socket.id} connected`);

    socket.on('disconnect', function() {
        console.log(`user ${socket.id} disconnected`);
    });

    socket.on('joinroom', function(room) {
        // set the socket's current room
        socket.room = room;

        // join the room
        socket.join(room);

        // emit welcome message to user
        socket.volatile.emit('message', 'SERVER', `Welcome to room "${room}"!`);

        // let room know a user just joined
        socket.volatile.in(room).emit('message', 'SERVER', `User ${socket.id} has joined room`);
    });

    socket.on('createroom', function(payload) {
        console.log('user created room')
    });

    socket.on('message', function(message) {
        io.sockets.in(socket.room).emit('message', socket.id, `${message}`);
    });
});
