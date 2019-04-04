const Room = require('../models/room');
const roomService = require('../services/room.service');

module.exports = {
  playSong(io, socket, payload) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          // update the song's current vote
          Room.findOneAndUpdate(
            // eslint-disable-next-line quote-props
            { _id: room._id },
            { $set: { isPlaying: true } },
            { new: true },
            (err, doc) => {
              if (err) reject(err);

              // emit the updated queue to the room
              io.sockets.in(room.joinCode).emit('PLAY_SONG', payload.songId);

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

  pauseSong(io, socket, payload) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          // update the song's current vote
          Room.findOneAndUpdate(
            // eslint-disable-next-line quote-props
            { _id: room._id },
            { $set: { isPlaying: false } },
            { new: true },
            (err, doc) => {
              if (err) reject(err);

              // emit the updated queue to the room
              io.sockets.in(room.joinCode).emit('PAUSE_SONG', payload.songId);

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

  skipSong(io, socket, payload) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      roomService.findRoom(socket.room).then(
        room => {
          // skip to the next song
          room.nextSong();

          // emit the updated queue to the room
          io.sockets.in(room.joinCode).emit('UPDATE_CURRENT_SONG', room.currentSong);
          io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', room.getSortedQueue());

          resolve(room);
        },
        err => {
          reject(err);
        }
      );
    });
  }
};
