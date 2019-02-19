const Room = require('./models/room');
const roomService = require('./services/room.service');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        // console.log('a user has connected');

        socket.on('joinroom', function(joinCode) {
            // check if the room exists
            roomService.findRoom(joinCode).then((room) => {
                if (room) {
                    // if it does exist join it
                    roomService.joinRoom(joinCode, socket).then((room) => {
                        console.log(`user joined room '${joinCode}'`);                        
                    }, (err) => {
                        console.error(err);
                    });
                } else {
                    // if it does not exist yet create the room
                    roomService.createRoom(joinCode, socket).then((room) => {
                        console.log(`new room '${joinCode}' created`);                        
                    }, (err) => {
                        console.error(err);
                    });
                }
            }, (err) => {
                console.error(err);
            });
            
        });

        socket.on('leaveroom', function() {
            if (socket.room) {
                roomService.leaveRoom(socket.room, socket).then((room) => {
                    console.log(`user left room '${room.joinCode}'`);                        
                }, (err) => {
                    console.error(err);
                });
            }
        });
    
        socket.on('message', function(message) {
            io.sockets.in(socket.room).emit('message', socket.id, `${message}`);
        });
    
        socket.on('disconnect', function() {
            // console.log('a user has disconnected');
            
            // if the socket is in a room, leave the room
            if (socket.room) {
                roomService.leaveRoom(socket.room, socket).then((room) => {
                    console.log(`user left room '${room.joinCode}'`);                        
                }, (err) => {
                    console.error(err);
                });
            }
        });
    });
}