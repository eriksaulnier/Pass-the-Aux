import { PLAY_SONG, PAUSE_SONG, SKIP_SONG, UPDATE_PLAYBACK_STATE } from './Types';
import { spotifyClient } from '../utils/SpotifyClient';
import { emit } from '../utils/Socket';

// resume playback using spotify api and dispatch event
export const playSong = () => {
  return dispatch => {
    spotifyClient.play().then(
      () => {
        emit(PLAY_SONG);

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
        emit(PAUSE_SONG);

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

// dispatch skip event
export const skipSong = () => {
  return dispatch => {
    emit(SKIP_SONG);

    dispatch({
      type: SKIP_SONG
    });
  };
};

// dispatch the new playback state
export const updatePlaybackState = state => {
  return dispatch => {
    dispatch({
      type: UPDATE_PLAYBACK_STATE,
      payload: state
    });
  };
};
