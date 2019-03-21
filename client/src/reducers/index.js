import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import roomReducer from './RoomReducer';
import queueReducer from './QueueReducers';

export default history =>
  combineReducers({
    router: connectRouter(history),
    roomReducer,
    queueReducer
  });
