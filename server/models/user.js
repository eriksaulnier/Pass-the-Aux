const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema, 'users');
