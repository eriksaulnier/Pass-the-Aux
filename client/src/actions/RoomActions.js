import { JOIN_ROOM_START, CREATE_ROOM_START, LEAVE_ROOM } from './Types';
import { emit } from '../utils/Socket';

export const joinRoom = (joinCode) => {
    return (dispatch) => {
        emit(JOIN_ROOM_START, {
            joinCode: joinCode
        });

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