import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';
import { loadSessionState, saveSessionState } from './utils/SessionStorage';
// import { loadLocalState, saveLocalState } from './utils/LocalStorage';

export const history = createBrowserHistory();

export default function configureStore() {
  // load the saved local and session state
  const persistedSessionState = loadSessionState();

  // create the store
  const store = createStore(
    createRootReducer(history),
    persistedSessionState,
    compose(applyMiddleware(routerMiddleware(history), thunk))
  );

  // subscribe to change events
  store.subscribe(() => {
    const state = store.getState();

    // save the session state
    saveSessionState({
      roomReducer: {
        room: state.roomReducer.room
      },
      queueReducer: {
        votes: state.queueReducer.votes
      },
      spotifyReducer: {
        accessToken: state.spotifyReducer.accessToken,
        refreshToken: state.spotifyReducer.accessToken,
        expiresEpoch: state.spotifyReducer.expiresEpoch,
        userId: state.spotifyReducer.userId,
        loggedIn: state.spotifyReducer.loggedIn
      }
    });
  });

  return store;
}
