const playbackService = require('../services/playback.service');

// socket listeners for playback functionality
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

  socket.on('UPDATE_PLAYBACK_STATE', state => {
    playbackService.updatePlaybackState(io, socket, state).then(
      () => {
        // console.log(`updated playback state in '${socket.room}'`);
      },
      err => {
        console.error(err);
      }
    );
  });
};
