import SpotifyWebApi from 'spotify-web-api-js';

export const spotifyClient = new SpotifyWebApi();

// function for setting the access token for the client
export const setAccessToken = accessToken => {
  spotifyClient.setAccessToken(accessToken);
};
