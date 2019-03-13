import { JOIN_ROOM_START } from './Types';
import { emit } from '../utils/Socket';
import { push } from 'connected-react-router';

export const joinRoom = (room) => {
    return (dispatch) => {
        emit(JOIN_ROOM_START, room);

        // TODO: this should be emitted after JOIN_ROOM_END
        setTimeout(() => {
            dispatch(push('/room'));
        }, 100);
    }
}