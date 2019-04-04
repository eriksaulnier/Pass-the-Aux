const SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
  generateAccessToken() {
    return new Promise((resolve, reject) => {
      // configure the spotify api with client credentials
      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
      });

      // generate an access token
      spotifyApi.clientCredentialsGrant().then(
        data => {
          // if successful, return body back to client
          resolve(data.body);
        },
        err => {
          // otherwise send error
          reject(err);
        }
      );
    });
  }
};
