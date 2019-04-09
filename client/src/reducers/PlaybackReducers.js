import { ROOM_INFO, RESET_QUEUE, PLAY_SONG, PAUSE_SONG, SKIP_SONG, UPDATE_CURRENT_SONG } from '../actions/Types';

const initialState = {
  currentSong: null,
  isPlaying: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ROOM_INFO:
      return Object.assign({}, state, {
        isPlaying: action.payload.isPlaying,
        currentSong: action.payload.currentSong
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

    case UPDATE_CURRENT_SONG:
      return Object.assign({}, state, {
        currentSong: action.payload
      });

    default:
      return state;
  }
};
