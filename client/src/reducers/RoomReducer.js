import { JOIN_ROOM_END } from '../actions/Types';

const initialState = {
    room: null,
    queue: [],
    queue: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM_END:
            return Object.assign({}, state, {
                room: action.payload
            });
        default:
            return state
    }
}