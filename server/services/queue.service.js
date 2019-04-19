const { ObjectId } = require('mongoose').Types;
const Room = require('../models/room');
const roomService = require('../services/room.service');
const playbackService = require('../services/playback.service');

module.exports = {
  addSong(io, socket, songData) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          // construct song object
          const song = Object.assign({}, songData, { _id: ObjectId() });

          // add the new song to the room's queue
          Room.findOneAndUpdate({ _id: room._id }, { $push: { queue: song } }, { new: true }, (err, doc) => {
            if (err) reject(err);

            // emit the updated queue to the room
            io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.getSortedQueue());

            // if there is no current song trigger the skip action
            if (!doc.currentSong) {
              playbackService.skipSong(io, socket);
            }

            resolve(doc);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  },

  removeSong(io, socket, songId) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          // remove the song from the room's queue
          Room.findOneAndUpdate({ _id: room._id }, { $pull: { queue: { _id: songId } } }, { new: true }, (err, doc) => {
            if (err) reject(err);

            // emit the updated queue to the room
            io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.getSortedQueue());

            resolve(doc);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  },

  voteSong(io, socket, payload) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          // update the song's current vote
          Room.findOneAndUpdate(
            // eslint-disable-next-line quote-props
            { _id: room._id, 'queue._id': payload.songId },
            { $inc: { 'queue.$.currentVote': payload.vote } },
            { new: true },
            (err, doc) => {
              if (err) reject(err);

              // emit the updated queue to the room
              io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.getSortedQueue());

              resolve(doc);
            }
          );
        },
        err => {
          reject(err);
        }
      );
    });
  },

  resetQueue(io, socket) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          Room.findOneAndUpdate(
            { _id: room._id },
            { $set: { queue: [], currentSong: null, isPlaying: false } },
            { new: true },
            (err, doc) => {
              if (err) reject(err);

              // emit the queue (or lack theirof) to the room
              io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.queue);

              resolve(doc);
            }
          );
        },
        err => {
          reject(err);
        }
      );
    });
  }
};
