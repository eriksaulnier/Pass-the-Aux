import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';
import { loadSessionState, saveSessionState } from './utils/SessionStorage';
import { loadLocalState, saveLocalState } from './utils/LocalStorage';

export const history = createBrowserHistory();

export default function configureStore() {
  // load the saved local and session state
  const persistedSessionState = loadSessionState();
  const persistedLocalState = loadLocalState();

  // create the store
  const store = createStore(
    createRootReducer(history),
    { ...persistedSessionState, ...persistedLocalState },
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
      }
    });

    // save the local state
    saveLocalState({
      spotifyReducer: {
        accessToken: state.spotifyReducer.accessToken,
        refreshToken: state.spotifyReducer.refreshToken,
        expires: state.spotifyReducer.expires,
        userId: state.spotifyReducer.userId,
        loggedIn: state.spotifyReducer.loggedIn
      }
    });
  });

  return store;
}
