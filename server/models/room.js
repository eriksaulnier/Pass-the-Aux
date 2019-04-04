const mongoose = require('mongoose');

const { Schema } = mongoose;

// fetch the song schema from the other file
const SongSchema = require('./song').schema;

// create the room schema structure
const RoomSchema = new Schema(
  {
    joinCode: { type: Schema.Types.String, required: true },
    owner: { type: Schema.Types.String, required: true },
    isPlaying: { type: Schema.Types.Boolean, default: false },
    currentSong: SongSchema,
    queue: [SongSchema]
  },
  {
    timestamps: true
  }
);

// moves the song at the top of queue to now playing
RoomSchema.methods.nextSong = function() {
  // if there are songs in the queue then set the next song
  if (this.queue.length > 0) {
    // pop the next song off the top of the sorted queue
    const nextSong = this.getSortedQueue().shift();

    // set the current song value
    this.currentSong = nextSong;

    // remove the current song from the queue
    this.queue.filter(item => item._id !== nextSong._id);
  } else {
    // reset the current song if the queue is empty
    this.currentSong = null;
  }

  // save the changes to the model
  this.save();
};

// returns the room's properly queue sorted
RoomSchema.methods.getSortedQueue = function() {
  return this.queue.sort((a, b) => {
    // first sort by current vote
    if (a.currentVote > b.currentVote) {
      return -1;
    } else if (b.currentVote > a.currentVote) {
      return 1;
    } else {
      const aDate = new Date(a.created);
      const bDate = new Date(b.created);

      // then sort by created date
      if (aDate > bDate) {
        return 1;
      } else if (bDate > aDate) {
        return -1;
      }

      return 0;
    }
  });
};

module.exports = mongoose.model('Room', RoomSchema, 'rooms');
