import io from 'socket.io-client';
import * as ActionTypes from '../actions/Types';

const socket = io.connect();

export const init = (store) => {
    Object.keys(ActionTypes).forEach((type) => {
        socket.on(type, (payload) => {
          store.dispatch({ type, payload });
        });
    });
};

export const emit = (type, payload) => {
    socket.emit(type, payload);
};
