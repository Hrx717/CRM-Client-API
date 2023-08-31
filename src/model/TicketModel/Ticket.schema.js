const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId
    },
    subject: {
        type: String,
        maxlength: 100,
        required: true,
        default: ''
    },
    openAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    type: {
        type: String,
        required: true,
        default: 'IT'
    },
    status: {
        type: String,
        maxlength: 30,
        required: true,
        default: 'pending operator response'
    },
    conversations: [{
        sender: {
            type: String,
            maxlength: 50,
            required: true,
            default: ''
        },
        message: {
            type: String,
            maxlength: 1000,
            required: true,
            default: ''
        },
        msgAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }]
});

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;