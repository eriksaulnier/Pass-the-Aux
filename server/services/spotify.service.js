const SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');

// key for storing spotify authoriation state as a cookie
const stateKey = 'spotify_auth_state';

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
    res.cookie(stateKey, state);

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

  handleAuthCallback(req, res) {
    // fetch parameters from response
    const code = req.query.code || null;
    const state = req.query.state || null;

    // fetch the state that was previously stored as a cookie
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    // make sure the returned state matches the one we stored
    if (state === null || state !== storedState) {
      // redirect back to client with an error
      res.redirect(
        `${process.env.CLIENT_URL}#${querystring.stringify({
          error: 'state_mismatch'
        })}`
      );
    } else {
      // clear the stored state
      res.clearCookie(stateKey);

      // use the authorization code to get access token
      spotifyApi.authorizationCodeGrant(code).then(
        response => {
          // redirect back to the client with tokens
          res.redirect(
            `${process.env.CLIENT_URL}#${querystring.stringify({
              access_token: response.body.access_token,
              refresh_token: response.body.refresh_token,
              expires_in: response.body.expires_in
            })}`
          );
        },
        err => {
          // redirect back to client with an error
          res.redirect(
            `${process.env.CLIENT_URL}#${querystring.stringify({
              error: 'refresh_failed'
            })}`
          );
        }
      );
    }
  },

  generateAccessToken() {
    return new Promise((resolve, reject) => {
      // generate an access token
      spotifyApi.clientCredentialsGrant().then(
        res => {
          // if successful, return body back to client
          resolve(res.body);
        },
        err => {
          // otherwise send error
          reject(err);
        }
      );
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
