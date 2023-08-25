const mongoose = require('mongoose');

const ResetPinSchema = new mongoose.Schema({
    pin: {
        type: String,
        maxlength: 6,
        minlength: 6
    },
    email: {
        type: String,
        minlength: 8,
        maxlength: 50,
        required: true
    },
});

const ResetPin = mongoose.model('reset_pin', ResetPinSchema);
module.exports = ResetPin;