import { JOIN_ROOM_END, RECEIVE_MESSAGE, UPDATE_QUEUE } from '../actions/Types';

const initialState = {
    room: null,
    messages: [],
    queue: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM_END:
            return Object.assign({}, state, {
                room: action.payload
            });
        case RECEIVE_MESSAGE:
            return Object.assign({}, state, {
                messages: state.messages.concat(action.payload)
            });
        case UPDATE_QUEUE:
            return Object.assign({}, state, {
                queue: action.payload
            });
        default:
            return state
    }
}