//This file details the different databases used in MongoDB pertaining to the room
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true
    },
    currentVote: {
        type: Schema.Types.Number,
        default: 0
    },
    // user: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    created: { type: Date, default: Date.now }
});

const RoomSchema = new Schema({
    joinCode: {
        type: Schema.Types.String,
        required: true
    },
    owner: {
        type: Schema.Types.String,
        required: true
    },
    participants: [{ type: Schema.Types.String, default: [] }],
    queue: [SongSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema, 'rooms');