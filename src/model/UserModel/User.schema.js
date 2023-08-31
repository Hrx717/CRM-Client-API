const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    company: {
        type: String,
        maxlength: 80,
        required: true
    },
    address: {
        type: String,
        maxlength: 100,
    },
    phone: {
        type: Number,
        maxlength: 15,
    },
    email: {
        type: String,
        minlength: 8,
        maxlength: 50,
        required: true
    },
    password: {
        type: String,
        maxlength: 100,
        required: true
    },
    user_type: {
        type: String,
        required: true,
        default: 'client'
    },
    refreshJWT: {
        token: {
            type: String,
            default: '',
            maxlength: 500
        },
        addedAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;