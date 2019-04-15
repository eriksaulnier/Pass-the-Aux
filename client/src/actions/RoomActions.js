import { JOIN_ROOM_START, CREATE_ROOM_START, LEAVE_ROOM } from './Types';
import { emit } from '../utils/Socket';

// join room using provided join code
export const joinRoom = joinCode => {
  return dispatch => {
    // emit event to server
    emit(JOIN_ROOM_START, joinCode);

    // dispatch event to app
    dispatch({
      type: JOIN_ROOM_START
    });
  };
};

// create a new room with the provided information
export const createRoom = payload => {
  return () => {
    // emit event to server
    emit(CREATE_ROOM_START, payload);
  };
};

// leave the current room
export const leaveRoom = () => {
  return dispatch => {
    // emit event to server
    emit(LEAVE_ROOM);

    // dispatch event to app
    dispatch({
      type: LEAVE_ROOM
    });
  };
};
