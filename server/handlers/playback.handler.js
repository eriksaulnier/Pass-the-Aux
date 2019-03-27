const playbackService = require('../services/playback.service');

module.exports = (io, socket) => {
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
};
