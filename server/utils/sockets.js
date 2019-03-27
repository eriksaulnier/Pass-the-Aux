/* eslint-disable no-multi-assign */
const roomHandler = require('../handlers/room.handler');
const queueHandler = require('../handlers/queue.handler');
const playbackHandler = require('../handlers/playback.handler');

module.exports = io => {
  io.on('connection', socket => {
    // hook up room socket event handlers
    roomHandler(io, socket);

    // hook up queue socket event handlers
    queueHandler(io, socket);

    // hook up playback socket event handlers
    playbackHandler(io, socket);
  });
};
