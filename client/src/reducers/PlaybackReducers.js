import {
  ROOM_INFO,
  RESET_QUEUE,
  PLAY_SONG,
  PAUSE_SONG,
  SKIP_SONG,
  UPDATE_CURRENT_SONG,
  UPDATE_PLAYBACK_STATE
} from '../actions/Types';
import { spotifyClient } from '../utils/SpotifyClient';

const initialState = {
  currentSong: null,
  isPlaying: false,
  duration: 0,
  position: 0,
  connected: false,
  skipping: true
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
        currentSong: null,
        skipping: true
      });

    case UPDATE_CURRENT_SONG:
      if (state.skipping) {
        // play the new song using the spotify client
        spotifyClient.play({ uris: [action.payload.spotifyUri] });

        return Object.assign({}, state, {
          currentSong: action.payload,
          skipping: false
        });
      } else {
        return Object.assign({}, state, {
          currentSong: action.payload
        });
      }

    case UPDATE_PLAYBACK_STATE:
      if (action.payload) {
        return Object.assign({}, state, {
          isPlaying: !action.payload.paused,
          duration: action.payload.duration,
          position: action.payload.position,
          connected: false
        });
      } else {
        return Object.assign({}, state, {
          connected: true
        });
      }

    default:
      return state;
  }
};
