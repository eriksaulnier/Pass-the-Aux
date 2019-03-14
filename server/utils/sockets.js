const roomService = require('../services/room.service');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('JOIN_ROOM_START', function(payload) {
            // check if the room exists
            roomService.findRoom(payload.joinCode).then((room) => {
                if (room) {
                    // if it does exist join it
                    roomService.joinRoom(room.joinCode, socket).then((room) => {
                        socket.emit('JOIN_ROOM_END', room.joinCode);
                        console.log(`user joined room '${room.joinCode}'`);                        
                    }, (err) => {
                        console.error(err);
                    });
                } else {
                    console.log('Room does not exist!');
                }
            }, (err) => {
                console.error(err);
            });
        });

        socket.on('CREATE_ROOM_START', function(payload) {
            // check if the room exists
            roomService.findRoom(payload.joinCode).then((room) => {
                if (!room) {
                    // if it does not exist yet create the room
                    roomService.createRoom(payload, socket).then((room) => {
                        socket.emit('JOIN_ROOM_END', room.joinCode);
                        console.log(`new room '${room.joinCode}' created`);                        
                    }, (err) => {
                        console.error(err);
                    });
                } else {
                    console.log('Room already exists!');
                }
            }, (err) => {
                console.error(err);
            });
        })

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
        
        socket.on('ADD_SONG', function(songTitle) {
            roomService.addSong(io, socket.room, songTitle).then((room) => {
                // console.log(`song added to '${socket.room}'`);
            }, (err) => {
                console.error(err);
            });
        });

        socket.on('REMOVE_SONG', function(songId) {
            roomService.removeSong(io, socket.room, songId).then((room) => {
                // console.log(`song removed from '${socket.room}'`);
            }, (err) => {
                console.error(err);
            });
        });

        socket.on('UPVOTE_SONG', function(songId) {
            roomService.upvoteSong(io, socket.room, songId).then((room) => {
                // console.log(`song upvoted in '${socket.room}'`);
            }, (err) => {
                console.error(err);
            });
        });

        socket.on('DOWNVOTE_SONG', function(songId) {
            roomService.downvoteSong(io, socket.room, songId).then((room) => {
                // console.log(`song downvoted in '${socket.room}'`);
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