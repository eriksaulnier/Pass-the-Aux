import { ADD_SONG, REMOVE_SONG, UPDATE_QUEUE } from './Types';
import { emit } from '../utils/Socket';

export const addSong = (songTitle) => {
    return () => {
        emit(ADD_SONG, songTitle);
    }
}

export const removeSong = (songId) => {
    return () => {
        emit(REMOVE_SONG, songId);
    }
}

export const updateQueue = (queue) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_QUEUE,
            payload: queue
        });
    }
}