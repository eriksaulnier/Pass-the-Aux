import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import roomReducer from './RoomReducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    roomReducer
});