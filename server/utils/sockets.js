/* eslint-disable no-multi-assign */
const roomService = require('../services/room.service');
const queueService = require('../services/queue.service');
const playbackService = require('../services/playback.service');

module.exports = io => {
  io.on('connection', socket => {
    socket.on('JOIN_ROOM_START', joinCode => {
      // check if the room exists
      roomService.findRoom(joinCode).then(
        room => {
          if (room) {
            // if it does exist join it
            roomService.joinRoom(socket, room.joinCode).then(
              res => {
                socket.emit('JOIN_ROOM_END', res.joinCode);
                console.log(`user joined room '${res.joinCode}'`);
              },
              err => {
                console.error(err);
              }
            );
          } else {
            console.log('Room does not exist!');
          }
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('CREATE_ROOM_START', payload => {
      // check if the room exists
      roomService.findRoom(payload.joinCode).then(
        room => {
          if (!room) {
            // if it does not exist yet create the room
            roomService.createRoom(socket, payload).then(
              res => {
                socket.emit('JOIN_ROOM_END', res.joinCode);
                console.log(`new room '${res.joinCode}' created`);
              },
              err => {
                console.error(err);
              }
            );
          } else {
            console.log('Room already exists!');
          }
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('LEAVE_ROOM', () => {
      // if the socket is in a room, leave the room
      if (socket.room) {
        roomService.leaveRoom(socket, socket.room).then(
          res => {
            console.log(`user left room '${res.joinCode}'`);
          },
          err => {
            console.error(err);
          }
        );
      }
    });

    socket.on('ADD_SONG', songTitle => {
      queueService.addSong(io, socket, songTitle).then(
        () => {
          // console.log(`song added to '${socket.room}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('REMOVE_SONG', songId => {
      queueService.removeSong(io, socket, songId).then(
        () => {
          // console.log(`song removed from '${socket.room}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('VOTE_SONG', payload => {
      queueService.voteSong(io, socket, payload).then(
        () => {
          // console.log(`song upvoted in '${socket.room}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('PLAY_SONG', payload => {
      playbackService.playSong(io, socket, payload).then(
        () => {
          // console.log(`started playing in '${socket.room}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('PAUSE_SONG', payload => {
      playbackService.pauseSong(io, socket, payload).then(
        () => {
          // console.log(`stopped playing in '${socket.room}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('SKIP_SONG', payload => {
      playbackService.skipSong(io, socket, payload).then(
        () => {
          // console.log(`skipped song in '${socket.room}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('RESET_QUEUE', () => {
      queueService.resetQueue(io, socket).then(
        room => {
          // console.log(`Queue deleted in '${room.joinCode}'`);
        },
        err => {
          console.error(err);
        }
      );
    });

    socket.on('disconnect', () => {
      // if the socket is in a room, leave the room
      if (socket.room) {
        roomService.leaveRoom(socket.room, socket).then(
          room => {
            console.log(`user left room '${room.joinCode}'`);
          },
          err => {
            console.error(err);
          }
        );
      }
    });
  });
};
