import SpotifyAPI from 'spotify-web-api-js';
import {
  SPOTIFY_TOKEN,
  SPOTIFY_SEARCH_SUCCESS,
  SPOTIFY_SEARCH_ERROR,
  SPOTIFY_TOKEN_SUCCESS,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_USER_INFO
} from './Types';
import { emit } from '../utils/Socket';

// fetches a new access token from the server using client credentials
export const getAccessToken = () => {
  return () => {
    emit(SPOTIFY_TOKEN);
  };
};

// refreshes the current access token using the refresh token
export const refreshAccessToken = refreshToken => {
  return () => {
    emit(SPOTIFY_REFRESH_TOKEN, refreshToken);
  };
};

// updates the tokens currently stored in the state
export const updateTokenStorage = payload => {
  return dispatch => {
    dispatch({
      type: SPOTIFY_TOKEN_SUCCESS,
      payload
    });
  };
};

// use the spotify api to search for songs
export const searchSongs = (query, token) => {
  return dispatch => {
    // create the spotify client
    const spotify = new SpotifyAPI();

    // set access token
    spotify.setAccessToken(token);

    // use api to search for tracks
    spotify.searchTracks(query, { limit: 6 }, (err, res) => {
      // dispatch search results
      if (!err && res.tracks.items.length > 0) {
        dispatch({
          type: SPOTIFY_SEARCH_SUCCESS,
          payload: res.tracks.items
        });
      } else {
        dispatch({
          type: SPOTIFY_SEARCH_ERROR,
          payload: res
        });
      }
    });
  };
};

// fetches info for the currently authenticated user
export const getCurrentUser = token => {
  return dispatch => {
    // create the spotify client
    const spotify = new SpotifyAPI();

    // set access token
    spotify.setAccessToken(token);

    // fetch current user info
    spotify.getMe().then(
      res => {
        dispatch({
          type: SPOTIFY_USER_INFO,
          payload: res
        });
      },
      err => {
        console.error(err);
      }
    );
  };
};
