import io from 'socket.io-client';
import * as ActionTypes from '../actions/Types';
import { joinRoom } from '../actions/RoomActions';
import configureStore from '../store';

const socket = io.connect(null, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
});

export const init = (store) => {
    Object.keys(ActionTypes).forEach((type) => {
        socket.on(type, (payload) => {
          store.dispatch({ type, payload });
        });
    });

    // handle reconnecting to rooms
    socket.on('connect', function() {
        const store = configureStore();
        const state = store.getState();
        if (state.roomReducer.room) {
            store.dispatch(joinRoom(state.roomReducer.room));
        }
    });
};

export const emit = (type, payload) => {
    socket.emit(type, payload);
};
