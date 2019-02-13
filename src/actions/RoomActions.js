import { JOIN_ROOM, SEND_MESSAGE, RECEIVE_MESSAGE } from './Types';
import { socket } from '../utils/Socket';

export const joinRoom = (room) => {
    return (dispatch) => {
        socket.emit('joinroom', room);

        dispatch({
            type: JOIN_ROOM,
            payload: room
        });
    }
}

export const sendMessage = (message) => {
    return (dispatch) => {
        socket.emit('message', message);

        dispatch({
            type: SEND_MESSAGE,
            payload: message
        });
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