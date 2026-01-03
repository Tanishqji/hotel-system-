const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['patient', 'doctor'],
        required: true,
    },
    specialization: {
        type: String, // only for doctors
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('user', UserSchema);
