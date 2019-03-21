import { JOIN_ROOM_START, JOIN_ROOM_END, LEAVE_ROOM } from '../actions/Types';

const initialState = {
  room: null,
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
    case JOIN_ROOM_END:
      // set the room code in the store
      return Object.assign({}, state, {
        room: action.payload
      });
    case LEAVE_ROOM:
      // reset back to the initial state
      return initialState;
    default:
      return state;
  }
};
