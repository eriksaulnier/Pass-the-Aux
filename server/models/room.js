const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    code: {
        type: Schema.Types.String,
        required: true
    },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);