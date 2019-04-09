const spotifyService = require('../services/spotify.service');

module.exports = socket => {
  socket.on('SPOTIFY_TOKEN', () => {
    // generate a new spotify api access token
    spotifyService.generateAccessToken().then(
      res => {
        socket.emit('SPOTIFY_TOKEN_SUCCESS', res);
      },
      err => {
        socket.emit('SPOTIFY_TOKEN_ERROR', err);
      }
    );
  });

  socket.on('SPOTIFY_REFRESH_TOKEN', refreshToken => {
    // refresh the spotify api access token
    spotifyService.refreshAccessToken(refreshToken).then(
      res => {
        socket.emit('SPOTIFY_TOKEN_SUCCESS', res);
      },
      err => {
        socket.emit('SPOTIFY_TOKEN_ERROR', err);
      }
    );
  });
};
