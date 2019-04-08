const SpotifyWebApi = require('spotify-web-api-node');
const querystring = require('querystring');

// key for storing spotify authoriation state as a cookie
const stateKey = 'spotify_auth_state';

// function for creating a ramdom state string
const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = {
  handleAuthRequest(req, res) {
    // create the spotify api client
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
      clientId: process.env.SPOTIFY_CLIENT_ID
    });

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
    res.redirect(authUrl);
  },

  handleAuthCallback(req, res) {
    // fetch variables from response
    const code = req.query.code || null;
    const state = req.query.state || null;

    // fetch the state that was stored as a cookie
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    // make sure the returned state matches the one we stored
    if (state === null || state !== storedState) {
      // redirect back to client with an error
      res.redirect(
        `/#${querystring.stringify({
          error: 'state_mismatch'
        })}`
      );
    } else {
      // clear the stored state
      res.clearCookie(stateKey);

      // TODO
      res.send(code);
      console.log('SUCCESSSSSSSS');
    }
  },

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
