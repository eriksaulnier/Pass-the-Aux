const ObjectId = require('mongoose').Types.ObjectId;
const Room = require('../models/room');

let service = {};

service.findRoom = findRoom;
service.createRoom = createRoom;
service.joinRoom = joinRoom;
service.leaveRoom = leaveRoom;
service.addSong = addSong;
service.removeSong = removeSong;
service.upvoteSong = upvoteSong;
service.downvoteSong = downvoteSong;

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

function createRoom(payload, socket) {
    return new Promise((resolve, reject) => {
        // use mongoose to create the room
        Room.create(payload, (err, room) => {
            if (err) reject(err);
            
            // join the room using service functionjoinCode
            joinRoom(payload.joinCode, socket).then((res) => {
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

                    // emit current queue to new user
                    socket.emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

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
                { $push: { queue: song } },
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // emit the updated queue to the room
                    io.sockets.in(joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}

function removeSong(io, joinCode, songId) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // remove the song from the room's queue
            Room.findOneAndUpdate(
                { _id: room._id },
                { $pull: { queue: { _id: songId } } },
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // emit the updated queue to the room
                    io.sockets.in(joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}

function upvoteSong(io, joinCode, songId) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // update the song's current vote
            Room.findOneAndUpdate(
                { _id: room._id, 'queue._id': songId },
                { $inc: { 'queue.$.currentVote': 1 } },
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // emit the updated queue to the room
                    io.sockets.in(joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}

function downvoteSong(io, joinCode, songId) {
    return new Promise((resolve, reject) => {
        // find the room using service function
        findRoom(joinCode).then((room) => {
            // update the song's current vote
            Room.findOneAndUpdate(
                { _id: room._id, 'queue._id': songId },
                { $inc: { 'queue.$.currentVote': -1 } },
                { new: true },
                function (err, doc) {
                    if (err) reject(err);

                    // emit the updated queue to the room
                    io.sockets.in(joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

                    resolve(doc);
                }
            );
        }, (err) => {
            reject(err);
        });
    });
}

// helper function for sorting the song queue
function sortQueue(a, b) {
    // first sort by current vote
    if (a.currentVote > b.currentVote) {
        return -1;
    } else if (b.currentVote > a.currentVote) {
        return 1;
    } else {
        const aDate = new Date(a.created);
        const bDate = new Date(b.created);

        // then sort by created date
        if (aDate > bDate) {
            return 1;
        } else if (bDate > aDate) {
            return -1;
        }
        
        return 0;
    }
}