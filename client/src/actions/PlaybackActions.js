import { PLAY_SONG, PAUSE_SONG, SKIP_SONG } from './Types';
import { emit } from '../utils/Socket';

export const playSong = songId => {
  return dispatch => {
    emit(PLAY_SONG, {
      songId
    });

    dispatch({
      type: PLAY_SONG,
      payload: {
        songId
      }
    });
  };
};

export const pauseSong = songId => {
  return dispatch => {
    emit(PAUSE_SONG, {
      songId
    });

    dispatch({
      type: PLAY_SONG,
      payload: {
        songId
      }
    });
  };
};

export const skipSong = songId => {
  return () => {
    emit(SKIP_SONG, {
      songId
    });
  };
};
