import { UPDATE_QUEUE, VOTE_SONG, RESET_QUEUE, LEAVE_ROOM } from '../actions/Types';

// the initial state for the reducer
const initialState = {
  queue: [],
  votes: {},
  currentSong: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_QUEUE:
      return Object.assign({}, state, {
        queue: action.payload
      });

    case VOTE_SONG:
      return Object.assign({}, state, {
        votes: { ...state.votes, [action.payload.songId]: action.payload.vote }
      });

    case RESET_QUEUE:
      return Object.assign({}, state, {
        queue: []
      });

    case LEAVE_ROOM:
      // resets back to the initial state
      return initialState;

    default:
      return state;
  }
};
