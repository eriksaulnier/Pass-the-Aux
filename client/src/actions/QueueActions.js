import { ADD_SONG, REMOVE_SONG, VOTE_SONG, UPDATE_QUEUE, RESET_QUEUE } from './Types';
import { emit } from '../utils/Socket';

// emit add song event
export const addSong = songData => {
  return () => {
    // emit event to server
    emit(ADD_SONG, songData);
  };
};

// emit remove song event
export const removeSong = songId => {
  return () => {
    // emit event to server
    emit(REMOVE_SONG, songId);
  };
};

// emit and dispatch song vote event
export const voteSong = (songId, vote) => {
  return dispatch => {
    // emit event to server
    emit(VOTE_SONG, {
      songId,
      vote
    });

    // dispatch event to app
    dispatch({
      type: VOTE_SONG,
      payload: {
        songId,
        vote
      }
    });
  };
};

// dispatch update queue event
export const updateQueue = queue => {
  return dispatch => {
    // dispatch event to app
    dispatch({
      type: UPDATE_QUEUE,
      payload: queue
    });
  };
};

// emit and dispatch reset queue event
export const resetQueue = () => {
  return dispatch => {
    // emit event to server
    emit(RESET_QUEUE);

    // dispatch event to app
    dispatch({
      type: RESET_QUEUE
    });
  };
};
