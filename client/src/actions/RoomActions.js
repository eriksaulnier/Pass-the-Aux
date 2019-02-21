import { JOIN_ROOM_START, JOIN_ROOM_END, SEND_MESSAGE, RECEIVE_MESSAGE } from './Types';
import { emit } from '../utils/Socket';

export const joinRoom = (room) => {
    return (dispatch) => {
        emit(JOIN_ROOM_START, room);

        // TODO: this should be emitted from the server
        dispatch({
            type: JOIN_ROOM_END,
            payload: room
        });
    }
}

export const sendMessage = (message) => {
    return () => {
        emit(SEND_MESSAGE, message);
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