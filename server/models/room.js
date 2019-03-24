const mongoose = require('mongoose');

const { Schema } = mongoose;

const SongSchema = new Schema({
  title: { type: Schema.Types.String, required: true },
  currentVote: { type: Schema.Types.Number, default: 0 },
  playedAt: Schema.Types.Date,
  nowPlaying: { type: Schema.Types.Boolean, default: false },
  created: { type: Date, default: Date.now }
});

const RoomSchema = new Schema(
  {
    joinCode: { type: Schema.Types.String, required: true },
    owner: { type: Schema.Types.String, required: true },
    participants: [{ type: Schema.Types.String, default: [] }],
    queue: [SongSchema],
    isPlaying: { type: Schema.Types.Boolean, default: false }
  },
  {
    timestamps: true
  }
);

// Returns the room's properly queue sorted
RoomSchema.methods.getSortedQueue = function() {
  return this.queue
    .filter(song => {
      return !song.playedAt;
    })
    .sort((a, b) => {
      // put the track that is now playing at the top
      if (a.nowPlaying && !b.nowPlaying) {
        return -1;
      }

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
