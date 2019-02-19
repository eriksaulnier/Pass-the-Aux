const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    // room: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Room',
    //     required: true
    // },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    body: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema, 'messages');