import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import * as serviceWorker from './serviceWorker';
import configureStore, { history } from './store';
import { init } from './utils/Socket';
import './index.scss';

import App from './App';
import RoomPage from './components/RoomPage';
import NotFoundPage from './components/NotFoundPage';

// configure the redux store
const store = configureStore();

// initialize socket distpatcher
init(store);

// configure routing
const routing = (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/room" component={RoomPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </ConnectedRouter>
);

ReactDOM.render(<Provider store={store}>{routing}</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
