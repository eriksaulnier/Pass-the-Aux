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
      'user-read-private'
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
                // make sure the user's spotify account is not free (playback will not work)
                if (result.body.product === 'open' || result.body.product === 'free') {
                  socket.emit('SPOTIFY_USER_ERROR', 'Pass The Aux does not work with non-premium Spotify accounts :(');
                  reject();
                } else {
                  // otherwise return response back to client
                  socket.emit('SPOTIFY_USER_SUCCESS', result.body);
                  socket.emit('SPOTIFY_TOKEN_SUCCESS', res.body);
                  resolve(res.body);
                }
              },
              error => {
                socket.emit('SPOTIFY_USER_ERROR', 'There was an error fetching your Spotify account');
                reject(error);
              }
            );
          },
          err => {
            // otherwise send token error
            socket.emit('SPOTIFY_TOKEN_ERROR', 'There was an error authenticating with Spotify');
            reject(err);
          }
        );
      } else {
        // generate an access token using client credentials
        spotifyApi.clientCredentialsGrant().then(
          res => {
            // if successful, return response back to client
            socket.emit('SPOTIFY_TOKEN_SUCCESS', res.body);
            resolve(res.body);
          },
          err => {
            // otherwise send error
            socket.emit('SPOTIFY_TOKEN_ERROR', 'There was an error authenticating with Spotify');
            reject(err);
          }
        );
      }
    });
  },

  refreshAccessToken(socket, payload) {
    return new Promise((resolve, reject) => {
      console.log(payload);
      spotifyApi.setAccessToken(payload.accessToken);
      spotifyApi.setRefreshToken(payload.refreshToken);
      spotifyApi.refreshAccessToken().then(
        res => {
          // if successful, return response back to client
          socket.emit('SPOTIFY_TOKEN_SUCCESS', res.body);
          resolve(res.body);
        },
        err => {
          // otherwise send error
          socket.emit('SPOTIFY_TOKEN_ERROR', 'There was an error authenticating with Spotify');
          reject(err);
        }
      );
    });
  }
};
