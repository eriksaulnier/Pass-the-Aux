import {
  SPOTIFY_REQUEST_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_TOKEN_SUCCESS,
  SPOTIFY_SEARCH_SUCCESS,
  SPOTIFY_SEARCH_ERROR,
  SPOTIFY_USER_SUCCESS,
  SPOTIFY_USER_ERROR,
  SPOTIFY_PLAYER_SUCCESS,
  SPOTIFY_PLAYER_ERROR
} from './Types';
import { spotifyClient } from '../utils/SpotifyClient';
import { emit } from '../utils/Socket';

// fetches a new access token from the server using optional auth code
export const getAccessToken = authCode => {
  return () => {
    // emit event to server
    emit(SPOTIFY_REQUEST_TOKEN, authCode);
  };
};

// refreshes the current access token using the refresh token
export const refreshAccessToken = (accessToken, refreshToken) => {
  return () => {
    // emit event to server
    emit(SPOTIFY_REFRESH_TOKEN, {
      accessToken,
      refreshToken
    });
  };
};

// updates the tokens currently stored in the state
export const updateTokenStorage = payload => {
  return dispatch => {
    // dispatch event to app
    dispatch({
      type: SPOTIFY_TOKEN_SUCCESS,
      payload
    });
  };
};

// callback function for when the spotify player has successfully initialized
export const playerInitSuccess = payload => {
  return dispatch => {
    // set the spotify api client's access token
    spotifyClient.setAccessToken(payload.accessToken);

    // transfer the user's account playback to the app
    spotifyClient.transferMyPlayback([payload.deviceId], null, (err, res) => {
      if (err) {
        // dispatch any errors to app
        dispatch({
          type: SPOTIFY_PLAYER_ERROR,
          payload: err
        });
      } else {
        // play the new song using the spotify client
        if (payload.currentSong) {
          spotifyClient.play({ uris: [payload.currentSong.spotifyUri], device_id: payload.deviceId });
        }

        // dispatch success to app
        dispatch({
          type: SPOTIFY_PLAYER_SUCCESS,
          payload: payload.deviceId
        });
      }
    });
  };
};

// callback function for when the spotify player fails to initialize
export const playerInitError = err => {
  return dispatch => {
    // dispatch event to app
    dispatch({
      type: SPOTIFY_PLAYER_ERROR,
      payload: err
    });
  };
};

// fetches profile info for the currently authenticated user
export const getCurrentUser = () => {
  return dispatch => {
    // fetch current user info
    spotifyClient.getMe().then(
      res => {
        // dispatch success to app
        dispatch({
          type: SPOTIFY_USER_SUCCESS,
          payload: res
        });
      },
      err => {
        // dispatch any errors to app
        dispatch({
          type: SPOTIFY_USER_ERROR,
          payload: err
        });
      }
    );
  };
};

// use the spotify api to search for songs
export const searchSongs = query => {
  return dispatch => {
    // use api to search for tracks
    spotifyClient.searchTracks(query, { limit: 6 }, (err, res) => {
      // dispatch search results
      if (!err && res.tracks.items.length > 0) {
        // dispatch success to app
        dispatch({
          type: SPOTIFY_SEARCH_SUCCESS,
          payload: res.tracks.items
        });
      } else {
        // dispatch any errors to app
        dispatch({
          type: SPOTIFY_SEARCH_ERROR,
          payload: err
        });
      }
    });
  };
};
