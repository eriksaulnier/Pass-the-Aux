import {
  SPOTIFY_TOKEN_SUCCESS,
  SPOTIFY_TOKEN_ERROR,
  SPOTIFY_SEARCH_SUCCESS,
  SPOTIFY_SEARCH_ERROR,
  SPOTIFY_USER_INFO
} from '../actions/Types';

const initialState = {
  accessToken: null,
  refreshToken: null,
  expiresEpoch: null,
  userId: null,
  searchResults: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SPOTIFY_TOKEN_SUCCESS:
      // update token info in store
      return Object.assign({}, state, {
        accessToken: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        expiresEpoch: new Date().getTime() / 1000 + parseInt(action.payload.expires_in)
      });

    case SPOTIFY_TOKEN_ERROR:
      // handle error
      console.error('Error refreshing access token');
      return state;

    case SPOTIFY_USER_INFO:
      // store the current user id in the store
      return Object.assign({}, state, {
        userId: action.payload.id || null
      });

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
