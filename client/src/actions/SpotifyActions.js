import SpotifyAPI from 'spotify-web-api-js';
import { SPOTIFY_TOKEN, SPOTIFY_SEARCH_SUCCESS, SPOTIFY_SEARCH_ERROR } from './Types';
import { emit } from '../utils/Socket';

export const refreshToken = () => {
  return () => {
    emit(SPOTIFY_TOKEN);
  };
};

export const searchSongs = (query, token) => {
  return dispatch => {
    // create the spotify client
    const spotify = new SpotifyAPI();

    // set access token
    spotify.setAccessToken(token);

    // use api to search for tracks
    spotify.searchTracks(query, { limit: 6 }, (err, data) => {
      // dispatch search results
      if (data.tracks.items.length > 0) {
        dispatch({
          type: SPOTIFY_SEARCH_SUCCESS,
          payload: data.tracks.items
        });
      } else {
        dispatch({
          type: SPOTIFY_SEARCH_ERROR,
          payload: data
        });
      }
    });
  };
};
