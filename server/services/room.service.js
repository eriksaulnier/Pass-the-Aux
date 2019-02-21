const ObjectId = require('mongoose').Types.ObjectId;
const Room = require('../models/room');

let service = {};

service.findRoom = findRoom;
service.createRoom = createRoom;
service.joinRoom = joinRoom;
service.leaveRoom = leaveRoom;
service.addSong = addSong;

module.exports = service;

function findRoom(joinCode) {
    return new Promise((resolve, reject) => {
        // use mongoose to find the room
        Room.find({joinCode: joinCode}, (err, rooms) => {
            if (err) reject(err);
            
            // check if any room results were found
            if (rooms.length < 1) resolve(null);   

            // return the room
            resolve(rooms[0]);
        });
    });
}

function createRoom(joinCode, socket) {
    return new Promise((resolve, reject) => {
        // use mongoose to create the room
        Room.create({joinCode: joinCode}, (err, room) => {
            if (err) reject(err);
            
            // join the room using service function
            joinRoom(joinCode, socket).then((res) => {
                // return the room
                resolve(room);
            }, (err) => {
                console.error(err);
            });
        });
    });
}

function joinRoom(joinCode, socket) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // add the user to the room
            Room.findOneAndUpdate(
                { _id: room._id },
                { $push: { participants: socket.id }},
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // set the socket's room
                    socket.room = room.joinCode;

                    // join the appropriate socket
                    socket.join(room.joinCode);

                    // emit welcome message to new user
                    socket.emit('RECEIVE_MESSAGE', {
                        user: 'SERVER',
                        body: `Welcome to room "${room.joinCode}"!`
                    });

                    // emit notification to rest of room
                    socket.in(room.joinCode).emit('RECEIVE_MESSAGE', {
                        user: 'SERVER',
                        body: `User ${socket.id} has joined the room}`
                    });

                    // emit current queue to new user
                    socket.emit('UPDATE_QUEUE', doc.queue);

                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}

function leaveRoom(joinCode, socket) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // add the user to the room
            Room.findOneAndUpdate(
                { _id: room._id },
                { $pull: { participants: socket.id }},
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // clear the socket's room
                    socket.room = null;

                    // leave the appropriate socket
                    socket.leave(room.joinCode);

                    // emit notification to rest of room
                    socket.in(room.joinCode).emit('RECEIVE_MESSAGE', {
                        user: 'SERVER',
                        body: `User ${socket.id} has left the room`
                    });
                    
                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}

function addSong(io, joinCode, songTitle) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // construct song object
            const song = {
                _id: ObjectId(),
                title: songTitle
            };

            // add the new song to the room's queue
            Room.findOneAndUpdate(
                { _id: room._id },
                { $push: { queue: song }},
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // emit the new queue to the room
                    io.sockets.in(joinCode).emit('UPDATE_QUEUE', doc.queue);

                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}