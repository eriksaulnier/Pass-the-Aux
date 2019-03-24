import { ROOM_INFO, UPDATE_QUEUE, RESET_QUEUE, PLAY_SONG, PAUSE_SONG, SKIP_SONG } from '../actions/Types';

const initialState = {
  currentSong: null,
  isPlaying: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ROOM_INFO:
      return Object.assign({}, state, {
        isPlaying: action.payload.isPlaying
      });
    case UPDATE_QUEUE:
      return Object.assign({}, state, {
        currentSong: action.payload.length > 0 ? action.payload[0] : null
      });
    case RESET_QUEUE:
      return Object.assign({}, state, {
        queue: []
      });
    case PLAY_SONG:
      return Object.assign({}, state, {
        isPlaying: true
      });
    case PAUSE_SONG:
      return Object.assign({}, state, {
        isPlaying: false
      });
    case SKIP_SONG:
      return Object.assign({}, state, {
        currentSong: null
      });
    default:
      return state;
  }
};
