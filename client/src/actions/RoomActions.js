import { JOIN_ROOM_START, JOIN_ROOM_END, SEND_MESSAGE, RECEIVE_MESSAGE } from './Types';
import { emit } from '../utils/Socket';

export const joinRoom = (room) => {
    return (dispatch) => {
        emit(JOIN_ROOM_START, room);

        dispatch({
            type: JOIN_ROOM_END,
            payload: room
        });
    }
}

export const sendMessage = (message) => {
    return (dispatch) => {
        emit(SEND_MESSAGE, message);

        // dispatch({
        //     type: SEND_MESSAGE,
        //     payload: message
        // });
    }
}

export const receiveMessage = (message) => {
    return (dispatch) => {
        dispatch({
            type: RECEIVE_MESSAGE,
            payload: message
        });
    }
}