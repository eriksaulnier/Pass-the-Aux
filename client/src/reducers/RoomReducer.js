import {
  JOIN_ROOM_START,
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_ERROR,
  ROOM_INFO,
  LEAVE_ROOM
} from '../actions/Types';

const initialState = {
  room: null,
  ownerId: null,
  queue: [],
  votes: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case JOIN_ROOM_START:
      // reset room variables in the state
      return Object.assign({}, state, {
        room: null
      });

    case JOIN_ROOM_SUCCESS:
      // set the room code in the store
      return Object.assign({}, state, {
        room: action.payload.joinCode
      });

    case JOIN_ROOM_ERROR:
      // handle error
      alert(action.payload);
      return state;

    case CREATE_ROOM_SUCCESS:
      // set the room code in the store
      return Object.assign({}, state, {
        room: action.payload.joinCode
      });

    case CREATE_ROOM_ERROR:
      // handle error
      alert(action.payload);
      return state;

    case ROOM_INFO:
      // update owner id in store
      return Object.assign({}, state, {
        ownerId: action.payload.owner
      });

    case LEAVE_ROOM:
      // reset back to the initial state
      return initialState;

    default:
      return state;
  }
};
