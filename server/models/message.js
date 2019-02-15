const mongoose, { Schema } = require('mongoose');

const MessageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    body: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Message', MessageSchema);