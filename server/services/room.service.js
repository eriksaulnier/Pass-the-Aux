const { ObjectId } = require('mongoose').Types;
const Room = require('../models/room');

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

module.exports = {
  findRoom(joinCode) {
    return new Promise((resolve, reject) => {
      // use mongoose to find the room
      Room.findOne({ joinCode }, (err, room) => {
        if (err) reject(err);

        // check if any room results were found
        if (!room) resolve(null);

        // return the room
        resolve(room);
      });
    });
  },

  createRoom(socket, payload) {
    return new Promise((resolve, reject) => {
      // use mongoose to create the room
      Room.create(payload, (err, room) => {
        if (err) reject(err);

        // join the room using service functionjoinCode
        this.joinRoom(socket, room.joinCode).then(
          res => {
            // return the room
            resolve(room);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  },

  joinRoom(socket, joinCode) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      this.findRoom(joinCode).then(
        room => {
          // add the user to the room
          Room.findOneAndUpdate(
            { _id: room._id },
            { $push: { participants: socket.id } },
            { new: true },
            (err, doc) => {
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
        },
        err => {
          reject(err);
        }
      );
    });
  },

  leaveRoom(socket) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      this.findRoom(socket.room).then(
        room => {
          // add the user to the room
          Room.findOneAndUpdate(
            { _id: room._id },
            { $pull: { participants: socket.id } },
            { new: true },
            (err, doc) => {
              if (err) reject(err);

              // leave the appropriate socket
              socket.leave(room.joinCode);

              // clear the socket's storage
              socket.room = null;

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

  addSong(io, socket, songTitle) {
    return new Promise((resolve, reject) => {
      // find the room using service function
      this.findRoom(socket.room).then(
        room => {
          // construct song object
          const song = {
            _id: ObjectId(),
            title: songTitle
          };

          // add the new song to the room's queue
          Room.findOneAndUpdate({ _id: room._id }, { $push: { queue: song } }, { new: true }, (err, doc) => {
            if (err) reject(err);

            // emit the updated queue to the room
            io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

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
      this.findRoom(socket.room).then(
        room => {
          // remove the song from the room's queue
          Room.findOneAndUpdate({ _id: room._id }, { $pull: { queue: { _id: songId } } }, { new: true }, (err, doc) => {
            if (err) reject(err);

            // emit the updated queue to the room
            io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

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
      this.findRoom(socket.room).then(
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
              io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.queue.sort(sortQueue));

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
      this.findRoom(socket.room).then(
        room => {
          Room.findOneAndUpdate({ _id: room._id }, { $set: { queue: [] } }, { new: true }, (err, doc) => {
            if (err) reject(err);

            // emit the queue (or lack theirof) to the room
            io.sockets.in(room.joinCode).emit('UPDATE_QUEUE', doc.queue);

            resolve(doc);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  }
};
