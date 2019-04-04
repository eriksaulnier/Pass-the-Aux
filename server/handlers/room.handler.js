const roomService = require('../services/room.service');

module.exports = socket => {
  socket.on('JOIN_ROOM_START', joinCode => {
    // check if the room exists
    roomService.findRoom(joinCode).then(
      room => {
        if (room) {
          // if it does exist join it
          roomService.joinRoom(socket, room.joinCode).then(
            res => {
              socket.emit('JOIN_ROOM_SUCCESS', res.joinCode);
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
              socket.emit('JOIN_ROOM_SUCCESS', res.joinCode);
              console.log(`new room '${res.joinCode}' created`);
            },
            err => {
              socket.emit('JOIN_ROOM_ERROR', err);
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
};
