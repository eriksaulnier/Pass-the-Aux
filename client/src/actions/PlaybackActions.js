import { PLAY_SONG, PAUSE_SONG, SKIP_SONG, UPDATE_PLAYBACK_STATE } from './Types';
import { spotifyClient } from '../utils/SpotifyClient';
import { emit } from '../utils/Socket';

// resume playback using spotify api and dispatch event
export const playSong = () => {
  return dispatch => {
    spotifyClient.play().then(
      () => {
        // emit event to server
        emit(PLAY_SONG);

        // dispatch event to app
        dispatch({
          type: PLAY_SONG
        });
      },
      err => {
        console.error(err);
      }
    );
  };
};

// pause playback using spotify api and dispatch event
export const pauseSong = () => {
  return dispatch => {
    // pause spotify playback
    spotifyClient.pause().then(
      () => {
        // emit event to server
        emit(PAUSE_SONG);

        // dispatch event to app
        dispatch({
          type: PAUSE_SONG
        });
      },
      err => {
        console.error(err);
      }
    );
  };
};

// emit and dispatch skip event
export const skipSong = () => {
  return dispatch => {
    // emit event to server
    emit(SKIP_SONG);

    // dispatch event to app
    dispatch({
      type: SKIP_SONG
    });
  };
};

// dispatch the new playback state
export const updatePlaybackState = state => {
  return dispatch => {
    // emit event to server
    emit(UPDATE_PLAYBACK_STATE, state);

    // dispatch event to app
    dispatch({
      type: UPDATE_PLAYBACK_STATE,
      payload: state
    });
  };
};
