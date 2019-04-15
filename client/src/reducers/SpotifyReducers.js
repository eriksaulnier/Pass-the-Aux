import {
  SPOTIFY_TOKEN_SUCCESS,
  SPOTIFY_TOKEN_ERROR,
  SPOTIFY_SEARCH_SUCCESS,
  SPOTIFY_SEARCH_ERROR,
  SPOTIFY_USER_SUCCESS,
  SPOTIFY_USER_ERROR,
  SPOTIFY_PLAYER_SUCCESS,
  SPOTIFY_PLAYER_ERROR
} from '../actions/Types';
import { spotifyClient } from '../utils/SpotifyClient';

// the initial state for the reducer
const initialState = {
  accessToken: null,
  refreshToken: null,
  expiresEpoch: null,
  userId: null,
  deviceId: null,
  searchResults: [],
  loggedIn: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SPOTIFY_TOKEN_SUCCESS:
      // update the spotify client's access token
      spotifyClient.setAccessToken(action.payload.access_token);

      // update token info in store
      return Object.assign({}, state, {
        loggedIn: true,
        accessToken: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        expiresEpoch: new Date().getTime() / 1000 + parseInt(action.payload.expires_in)
      });

    case SPOTIFY_TOKEN_ERROR:
      // handle error
      console.error('Error refreshing access token');
      return Object.assign({}, state, {
        loggedIn: false
      });

    case SPOTIFY_PLAYER_SUCCESS:
      // store the device id in the store
      return Object.assign({}, state, {
        deviceId: action.payload || null
      });

    case SPOTIFY_PLAYER_ERROR:
      // handle error
      console.error(action.payload);
      return state;

    case SPOTIFY_USER_SUCCESS:
      // store the current user id in the store
      return Object.assign({}, state, {
        userId: action.payload.id || null
      });

    case SPOTIFY_USER_ERROR:
      // handle error
      console.error('Error fetching current user info');
      return state;

    case SPOTIFY_SEARCH_SUCCESS:
      // store the search results in the store
      return Object.assign({}, state, {
        searchResults: action.payload
      });

    case SPOTIFY_SEARCH_ERROR:
      // handle error
      console.error('Error loading search results');
      return state;

    default:
      return state;
  }
};
