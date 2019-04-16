const spotifyService = require('../services/spotify.service');

// socket listeners for spotify functionality
module.exports = socket => {
  socket.on('SPOTIFY_REQUEST_TOKEN', authCode => {
    // generate a new spotify api access token using client credentials
    spotifyService.generateAccessToken(socket, authCode).then(
      res => {
        //
      },
      err => {
        console.error(err);
      }
    );
  });

  socket.on('SPOTIFY_REFRESH_TOKEN', refreshToken => {
    // refresh the spotify api access token
    spotifyService.refreshAccessToken(socket, refreshToken).then(
      res => {
        //
      },
      err => {
        console.error(err);
      }
    );
  });
};
