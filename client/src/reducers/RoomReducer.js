import { JOIN_ROOM, RECEIVE_MESSAGE } from '../actions/Types';

const initialState = {
    room: null,
    messages: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM:
            return Object.assign({}, state, {
                room: action.payload
            });
        case RECEIVE_MESSAGE:
            return Object.assign({}, state, {
                messages: state.messages.concat(action.payload)
            });
        default:
            return state
    }
}