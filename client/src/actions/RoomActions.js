import { JOIN_ROOM_START, CREATE_ROOM_START, LEAVE_ROOM } from './Types';
import { emit } from '../utils/Socket';

//These send the the room related functions to the sockets
export const joinRoom = (joinCode) => {
    return (dispatch) => {
        emit(JOIN_ROOM_START, joinCode);

        dispatch({
            type: JOIN_ROOM_START
        });
    }
}

export const createRoom = (payload) => {
    return () => {
        emit(CREATE_ROOM_START, payload);
    }
}

export const leaveRoom = () => {
    return (dispatch) => {
        emit(LEAVE_ROOM);

        dispatch({
            type: LEAVE_ROOM
        });
    }
}