const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);