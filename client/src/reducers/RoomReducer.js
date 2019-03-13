import { JOIN_ROOM_END } from '../actions/Types';

const initialState = {
    room: null,
    queue: [],
    votes: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case JOIN_ROOM_END:
            // check if the room is being switched
            if (sessionStorage.getItem('room') !== null && sessionStorage.getItem('room') !== action.payload) {
                // reset session storage
                sessionStorage.clear();
            }

            return Object.assign({}, state, {
                room: action.payload
            });
        default:
            return state
    }
}