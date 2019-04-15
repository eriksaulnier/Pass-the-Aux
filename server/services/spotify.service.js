const SpotifyWebApi = require('spotify-web-api-node');

// function for creating a random state string for authentication
const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// create the spotify api client using the client credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

module.exports = {
  handleAuthRequest(req, res) {
    // generate random state string and store it as a cookie
    const state = generateRandomString(16);
    res.cookie('spotify_auth_state', state);

    // set up spotify permission scope array
    const scopes = [
      'streaming',
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-birthdate',
      'user-read-email',
      'user-read-private',
      'playlist-read-collaborative',
      'playlist-read-private'
    ];

    // generate authorization url
    const authUrl = spotifyApi.createAuthorizeURL(scopes, state);

    // redirect user to spotify authorization url
    res.send({ url: authUrl });
  },

  generateAccessToken(socket, authCode) {
    return new Promise((resolve, reject) => {
      if (authCode) {
        // use the authorization code to get access token
        spotifyApi.authorizationCodeGrant(authCode).then(
          res => {
            spotifyApi.setAccessToken(res.body.access_token);

            // fetch the user's info and send it back to the client
            spotifyApi.getMe().then(
              result => {
                socket.emit('SPOTIFY_USER_SUCCESS', result.body);
              },
              error => {
                socket.emit('SPOTIFY_USER_ERROR', error);
              }
            );

            // if successful, return response back to client
            resolve(res.body);
          },
          err => {
            // otherwise send error
            reject(err);
          }
        );
      } else {
        // generate an access token using client credentials
        spotifyApi.clientCredentialsGrant().then(
          res => {
            // if successful, return response back to client
            resolve(res.body);
          },
          err => {
            // otherwise send error
            reject(err);
          }
        );
      }
    });
  },

  refreshAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
      spotifyApi.setRefreshToken(refreshToken);
      spotifyApi.refreshAccessToken().then(
        res => {
          resolve(res.body);
        },
        err => {
          reject(err);
        }
      );
    });
  }
};
