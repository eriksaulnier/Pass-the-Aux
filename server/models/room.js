const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    body: {
        type: Schema.Types.String,
        required: true
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
}, {
    timestamps: true
});

const RoomSchema = new Schema({
    joinCode: {
        type: Schema.Types.String,
        required: true
    },
    participants: [{ type: Schema.Types.String, default: [] }],
    messages: [MessageSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema, 'rooms');