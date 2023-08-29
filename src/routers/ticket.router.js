const express = require('express');
const { insertTicket, getAllTickets, getTicketById,
    updateClientReply, updateStatusClose, deleteTicket } = require('../model/TicketModel/Ticket.model');
const { userAuthorization } = require('../middlewares/authorization.middleware');
const { createNewTicketValidation, replyTicketMessageValidation } = require('../middlewares/formValidation.middleware');

const router = express.Router();

//save a new ticket of spcific user
router.post('/', userAuthorization, createNewTicketValidation ,async (req,res) => {
    const {subject, sender, message, issueDate} = req.body;
    const _id = req.userId;
    const ticketObj = {
        clientId: _id,
        subject,
        openAt: issueDate,
        conversations: [
            {
                sender,
                message
            }
        ]
    };

    const result = await insertTicket(ticketObj);
    if(result) {
        console.log(result);
        return res.json({status: 'success',message: "new ticket created"});
    }
    res.json({status: 'error',message: "unable to create ticket, try after sometime"});
});

//get all tickets but for specific user only
router.get('/',userAuthorization, async (req,res) => {
    const userId = req.userId;
    const result = await getAllTickets(userId);
    if(result) {
        return res.json({status: 'success',result});
    }

    res.json({status: 'error',message: "no existing tickets found for the current user"});
});

//get single ticket of a specific user
router.get('/:ticketId',userAuthorization, async (req,res) => {
    const {ticketId} = req.params
    const userId = req.userId;
    const result = await getTicketById(ticketId, userId);
    if(result) {
        return res.json({status: 'success',result});
    }

    res.json({status: 'error',message: "no existing tickets found for the current user"});
});

//update ticket details i.e., reply messages
router.put('/:ticketId',replyTicketMessageValidation, userAuthorization, async (req,res) => {
    const {message, sender} = req.body;
    const {ticketId} = req.params;
    const userId = req.userId;

    const result = await updateClientReply(ticketId, userId, sender, message);
    if(result) {
        return res.json({status: 'success',message: 'your message updated'});
    }

    res.json({status: 'error',message: "Error occured! unable to update message"});
});

//update the ticket status to close-ticket
router.patch('/close-ticket/:ticketId', userAuthorization, async (req,res) => {
    const {ticketId} = req.params;
    const userId = req.userId;

    const result = await updateStatusClose(ticketId, userId);
    if(result) {
        return res.json({status: 'success',message: 'ticket-closed'});
    }

    res.json({status: 'error',message: "Error occured! unable to close the ticket"});
});

//delete ticket
router.delete('/:ticketId', userAuthorization, async (req,res) => {
    const {ticketId} = req.params;
    const userId = req.userId;

    const result = await deleteTicket(ticketId, userId);
    if(result) {
        return res.json({status: 'success',message: 'ticket-deleted'});
    }

    res.json({status: 'error',message: "Error occured! unable to delete the ticket"});
});

module.exports = router;