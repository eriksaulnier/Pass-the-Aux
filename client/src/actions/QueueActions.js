import { ADD_SONG, UPDATE_QUEUE } from './Types';
import { emit } from '../utils/Socket';

export const addSong = (songTitle) => {
    return () => {
        emit(ADD_SONG, songTitle);
    }
}

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