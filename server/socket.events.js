exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        // socket.on('createroom', function(payload) {
        //     console.log('user created room')
        // });

        socket.on('joinroom', function(room) {
            // set the socket's current room
            socket.room = room;
    
            // join the room
            socket.join(room);
    
            // emit welcome message to user
            socket.volatile.emit('message', 'SERVER', `Welcome to room "${room}"!`);
    
            // let room know a user just joined
            socket.volatile.in(room).emit('message', 'SERVER', `User ${socket.id} has joined the room`);
        });
    
        socket.on('message', function(message) {
            io.sockets.in(socket.room).emit('message', socket.id, `${message}`);
        });
    
        socket.on('leaveroom', function(room) {
            // clear the socket's current room
            socket.room = null;
    
            // leave the room
            socket.leave(room);
    
            // emit leave message to user
            socket.volatile.emit('message', 'SERVER', `You left the room`);
    
            // let room know a user just left
            socket.volatile.in(room).emit('message', 'SERVER', `User ${socket.id} has left the room`);
        });

        socket.on('disconnect', function() {
            if (socket.room) {
                // leave the room
                socket.leave(socket.room);
                
                // let room know a user just left
                socket.volatile.in(socket.room).emit('message', 'SERVER', `User ${socket.id} has left the room`);

                // clear the socket's current room
                socket.room = null;
            }
        });
    });
}