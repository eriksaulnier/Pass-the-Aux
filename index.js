const express = require('express');
const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

if (process.env.NODE_ENV !== 'production') {
    io.origins('*:*');
}

// serve static files from the react app
app.use(express.static(path.join(__dirname, 'client/build')));

// send back reacts index file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// start the express server
const port = process.env.PORT || 5000;
http.listen(port, () => console.log(`Listening on port ${port}`));

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
