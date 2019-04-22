import {
  SPOTIFY_TOKEN_SUCCESS,
  SPOTIFY_TOKEN_ERROR,
  SPOTIFY_SEARCH_SUCCESS,
  SPOTIFY_SEARCH_ERROR,
  SPOTIFY_USER_SUCCESS,
  SPOTIFY_USER_ERROR,
  SPOTIFY_PLAYER_SUCCESS,
  SPOTIFY_PLAYER_ERROR,
  ROOM_INFO,
  LEAVE_ROOM
} from '../actions/Types';
import { spotifyClient } from '../utils/SpotifyClient';

// the initial state for the reducer
const initialState = {
  loggedIn: false,
  accessToken: null,
  refreshToken: null,
  expires: null,
  userId: null,
  deviceId: null,
  isRoomOwner: false,
  searchResults: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SPOTIFY_TOKEN_SUCCESS:
      // update the spotify client's access token
      spotifyClient.setAccessToken(action.payload.access_token);

      // check if the user is logged into their own account
      const isLoggedIn = action.payload.token_type === 'Bearer';

      // update token info in store
      return Object.assign({}, state, {
        loggedIn: isLoggedIn,
        accessToken: action.payload.access_token,
        refreshToken: isLoggedIn ? state.refreshToken || action.payload.refresh_token : null,
        expires: new Date(Date.now() + 1000 * parseInt(action.payload.expires_in))
      });

    case SPOTIFY_TOKEN_ERROR:
      // handle error
      alert(action.payload);
      return Object.assign({}, state, {
        loggedIn: false,
        userId: null
      });

    case SPOTIFY_PLAYER_SUCCESS:
      // store the device id in the store
      return Object.assign({}, state, {
        deviceId: action.payload || null
      });

    case SPOTIFY_PLAYER_ERROR:
      // handle error
      alert(action.payload);
      return state;

    case SPOTIFY_USER_SUCCESS:
      // store the current user id in the store
      return Object.assign({}, state, {
        userId: action.payload.id || null
      });

    case SPOTIFY_USER_ERROR:
      // handle error
      alert(action.payload);
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

    case ROOM_INFO:
      // update the isRoomOwner flag
      return Object.assign({}, state, {
        isRoomOwner: state.userId === action.payload.owner
      });

    case LEAVE_ROOM:
      // reset back to the initial state
      return Object.assign({}, state, {
        isRoomOwner: false,
        searchResults: []
      });

    default:
      return state;
  }
};
