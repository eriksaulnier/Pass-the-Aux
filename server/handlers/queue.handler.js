const queueService = require('../services/queue.service');

module.exports = (io, socket) => {
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
};
