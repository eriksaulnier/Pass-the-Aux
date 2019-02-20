import { ADD_SONG, UPDATE_QUEUE } from './Types';
import { emit } from '../utils/Socket';

export const addSong = (song) => {
    return (dispatch) => {
        emit(ADD_SONG, song);

        // dispatch({
        //     type: ADD_SONG,
        //     payload: song
        // });
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