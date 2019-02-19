const Room = require('./models/room');
const roomService = require('./services/room.service');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('a user has connected');

        socket.on('createroom', function(joinCode) {
            roomService.createRoom(joinCode).then((res) => {
                console.log(res);
            }, (err) => {
                console.error(err);
            });
        });

        socket.on('joinroom', function(joinCode) {
            // check if the room exists
            roomService.findRoom(joinCode).then((room) => {
                if (room) {
                    // if it does exist join it
                    roomService.joinRoom(joinCode, socket).then((res) => {
                        console.log(res);
                    }, (err) => {
                        console.error(err);
                    });
                } else {
                    // if it does not exist create the room and join it
                    roomService.createRoom(joinCode).then((res) => {
                        roomService.joinRoom(joinCode, socket).then((res) => {
                            console.log(res);
                        }, (err) => {
                            console.error(err);
                        });
                    }, (err) => {
                        console.error(err);
                    });
                }
            }, (err) => {
                console.error(err);
            });
            
        });
    
        socket.on('message', function(message) {
            io.sockets.in(socket.room).emit('message', socket.id, `${message}`);
        });
    
        socket.on('disconnect', function() {
            console.log('a user has disconnected');
            
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