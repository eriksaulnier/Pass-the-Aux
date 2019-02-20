const roomService = require('./services/room.service');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('JOIN_ROOM_START', function(joinCode) {
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

        socket.on('LEAVE_ROOM', function() {
            // if the socket is in a room, leave the room
            if (socket.room) {
                roomService.leaveRoom(socket.room, socket).then((room) => {
                    console.log(`user left room '${room.joinCode}'`);                        
                }, (err) => {
                    console.error(err);
                });
            }
        });
    
        socket.on('SEND_MESSAGE', function(message) {
            // emit the message to the room
            io.sockets.in(socket.room).emit('RECEIVE_MESSAGE', {
                user: socket.id,
                body: `${message}`
            });

            console.log(`message sent to '${socket.room}'`);
        });

        socket.on('ADD_SONG', function(song) {
            roomService.addSong(io, socket.room, song).then((room) => {
                console.log(`song added to '${socket.room}'`);
            }, (err) => {
                console.error(err);
            });
        });
    
        socket.on('disconnect', function() {            
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