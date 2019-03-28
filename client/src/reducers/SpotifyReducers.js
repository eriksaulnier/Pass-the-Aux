import {
  SPOTIFY_TOKEN_SUCCESS,
  SPOTIFY_TOKEN_ERROR,
  SPOTIFY_SEARCH_SUCCESS,
  SPOTIFY_SEARCH_ERROR
} from '../actions/Types';

const initialState = {
  accessToken: null,
  expires: null,
  searchResults: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SPOTIFY_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        accessToken: action.payload.access_token,
        expires: new Date() + action.payload.expires_in
      });
    case SPOTIFY_TOKEN_ERROR:
      console.error('Error refreshing access token');
      return state;
    case SPOTIFY_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        searchResults: action.payload
      });
    case SPOTIFY_SEARCH_ERROR:
      // console.error('Could not find search results');
      return state;
    default:
      return state;
  }
};
