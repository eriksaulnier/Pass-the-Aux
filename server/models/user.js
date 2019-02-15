const mongoose, { Schema } = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true
    }
});

export default mongoose.model('User', UserSchema);