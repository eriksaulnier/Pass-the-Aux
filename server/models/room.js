const mongoose, { Schema } = require('mongoose');

const RoomSchema = new Schema({
    code: {
        type: Schema.Types.String,
        required: true
    },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

export default mongoose.model('Room', RoomSchema);