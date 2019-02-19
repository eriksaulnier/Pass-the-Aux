const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    joinCode: {
        type: Schema.Types.String,
        required: true
    },
    participants: [{ type: Schema.Types.String, default: [] }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema, 'rooms');