import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import roomReducer from './RoomReducer';
import queueReducer from './QueueReducers';
import playbackReducer from './PlaybackReducers';
import spotifyReducer from './SpotifyReducers';

export default history =>
  combineReducers({
    router: connectRouter(history),
    roomReducer,
    queueReducer,
    playbackReducer,
    spotifyReducer
  });
