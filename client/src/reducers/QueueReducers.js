import { UPDATE_QUEUE, VOTE_SONG, LEAVE_ROOM } from '../actions/Types';

const initialState = {
  queue: [],
  votes: {}
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
    case LEAVE_ROOM:
      // resets back to the initial state
      return initialState;
    default:
      return state;
  }
};
