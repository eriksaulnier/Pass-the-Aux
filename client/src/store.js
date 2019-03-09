import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

export default function configureStore() {
    return createStore(
        createRootReducer(history),
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunk
            )
        )
    );
}