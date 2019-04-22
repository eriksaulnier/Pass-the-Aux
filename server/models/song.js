const mongoose = require('mongoose');

const { Schema } = mongoose;

// create the song schema structure
const SongSchema = new Schema({
  title: { type: Schema.Types.String, required: true },
  artist: Schema.Types.String,
  artwork: Schema.Types.String,
  spotifyId: { type: Schema.Types.String, required: true },
  spotifyUri: { type: Schema.Types.String, required: true },
  currentVote: { type: Schema.Types.Number, default: 0 },
  explicit: { type: Schema.Types.Boolean, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Song', SongSchema);
