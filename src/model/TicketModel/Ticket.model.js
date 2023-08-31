const Ticket = require('./Ticket.schema');

const insertTicket = (ticketObj) => {
    return new Promise((resolve, reject) => {
        new Ticket(ticketObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
}

const getAllTickets = (userId, user_type) => {
    if(user_type==='root') {
        return new Promise((resolve, reject) => {
            Ticket.find()
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        });
    }
    else if(user_type==='client' || user_type==='') {
        return new Promise((resolve, reject) => {
            Ticket.find({clientId: userId})
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        });
    }
    else {
        return new Promise((resolve, reject) => {
            Ticket.find().or([{type: user_type}, {type: 'Other'}, {clientId: userId}])
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        });
    }
}

//get single ticket
const getTicketById = (ticketId, userId) => {
    return new Promise((resolve, reject) => {
        Ticket.findById({_id: ticketId})
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
}

//update reply message from client
const updateClientReply = (ticketId, userId, sender, message) => {
    return new Promise((resolve, reject) => {
        Ticket.findOneAndUpdate({_id: ticketId}, {
            status: 'Pending operator response',
            $push: {
                conversations: {sender, message}
            }
        }, 
        {new: true})
        .then((data)=>{
            console.log(data);
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

//close the ticket
const updateStatusClose = (ticketId, userId) => {
    return new Promise((resolve, reject) => {
        Ticket.findOneAndUpdate({_id: ticketId}, {
            status: 'Closed',}, {new: true})
        .then((data)=>{
            console.log(data);
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

//delete ticket
const deleteTicket = (ticketId, userId) => {
    return new Promise((resolve, reject) => {
        Ticket.findOneAndDelete({_id: ticketId})
        .then((data)=>{
            console.log(data);
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

module.exports = {insertTicket, getAllTickets, 
    getTicketById, updateClientReply, updateStatusClose, deleteTicket};