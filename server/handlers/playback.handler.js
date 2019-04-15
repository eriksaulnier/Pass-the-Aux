const playbackService = require('../services/playback.service');

module.exports = (io, socket) => {
  socket.on('PLAY_SONG', () => {
    playbackService.playSong(io, socket).then(
      () => {
        // console.log(`started playing in '${socket.room}'`);
      },
      err => {
        console.error(err);
      }
    );
  });

  socket.on('PAUSE_SONG', () => {
    playbackService.pauseSong(io, socket).then(
      () => {
        // console.log(`stopped playing in '${socket.room}'`);
      },
      err => {
        console.error(err);
      }
    );
  });

  socket.on('SKIP_SONG', () => {
    playbackService.skipSong(io, socket).then(
      () => {
        // console.log(`skipped song in '${socket.room}'`);
      },
      err => {
        console.error(err);
      }
    );
  });
};
