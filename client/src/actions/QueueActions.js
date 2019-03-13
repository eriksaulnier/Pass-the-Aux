import { ADD_SONG, REMOVE_SONG, UPVOTE_SONG, DOWNVOTE_SONG, UPDATE_QUEUE } from './Types';
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

export const upvoteSong = (songId) => {
    return (dispatch) => {
        emit(UPVOTE_SONG, songId);

        dispatch({
            type: UPVOTE_SONG,
            payload: songId
        });
    }
}

export const downvoteSong = (songId) => {
    return (dispatch) => {
        emit(DOWNVOTE_SONG, songId);

        dispatch({
            type: DOWNVOTE_SONG,
            payload: songId
        });
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