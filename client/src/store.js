import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';
import { loadState, saveState } from './utils/SesssionStorage';

export const history = createBrowserHistory();

export default function configureStore() {
    const persistedState = loadState();

    const store = createStore(
        createRootReducer(history),
        persistedState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunk
            )
        )
    );

    store.subscribe(() => {
        const state = store.getState();
        saveState({
            roomReducer: {
                room: state.roomReducer.room
            },
            queueReducer: {
                votes: state.queueReducer.votes,
                queue: state.queueReducer.queue
            }
        });
    });

    return store;
}