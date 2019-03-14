import { UPDATE_QUEUE, UPVOTE_SONG, DOWNVOTE_SONG, LEAVE_ROOM } from '../actions/Types';

const initialState = {
    queue: [],
    votes: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_QUEUE:
            return Object.assign({}, state, {
                queue: action.payload
            });
        case UPVOTE_SONG:
            return Object.assign({}, state, {
                votes: { ...state.votes, [action.payload]: 1 }
            });
        case DOWNVOTE_SONG:
            return Object.assign({}, state, {
                votes: Object.assign(state.votes, { [action.payload]: -1 })
            });
        case LEAVE_ROOM:
            // resets back to the initial state
            return initialState;
        default:
            return state
    }
}