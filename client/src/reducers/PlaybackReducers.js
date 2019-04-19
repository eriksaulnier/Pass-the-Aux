import {
  PLAY_SONG,
  PAUSE_SONG,
  SKIP_SONG,
  UPDATE_CURRENT_SONG,
  UPDATE_PLAYBACK_STATE,
  RESET_QUEUE,
  ROOM_INFO,
  LEAVE_ROOM
} from '../actions/Types';
import { spotifyClient } from '../utils/SpotifyClient';

// the initial state for the reducer
const initialState = {
  currentSong: null,
  isPlaying: false,
  duration: 0,
  position: 0,
  connected: false,
  skipping: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ROOM_INFO:
      return Object.assign({}, state, {
        isPlaying: action.payload.isPlaying,
        currentSong: action.payload.currentSong
      });

    case RESET_QUEUE:
      // pause spotify client playback
      spotifyClient.pause();

      return Object.assign({}, state, {
        currentSong: null,
        skipping: true
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
      // check if the state is curently waiting for a new song
      if (state.skipping || !state.currentSong) {
        // check if a new song was provided
        if (action.payload) {
          // play the new song using the spotify client
          spotifyClient.play({ uris: [action.payload.spotifyUri] });

          // set skipping to false and update currentSong
          return Object.assign({}, state, {
            currentSong: action.payload,
            skipping: false
          });
        } else {
          // pause spotify client playback
          spotifyClient.pause();

          // set skipping to true and wait for next song
          return Object.assign({}, state, {
            currentSong: action.payload,
            skipping: true
          });
        }
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

    case LEAVE_ROOM:
      // pause spotify client playback
      spotifyClient.pause();

      return initialState;

    default:
      return state;
  }
};
