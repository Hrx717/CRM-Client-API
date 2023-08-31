const Joi = require('joi');

const email = Joi.string().email({
    minDomainSegments: 2,
    tlds: {allow: ['com', 'net']}
});

const pin = Joi.number().min(6).max(6);
const newPassword = Joi.string().alphanum().min(6).max(30).required();

const shortStr = Joi.string().min(2).max(50);
const longStr = Joi.string().min(2).max(1000);
const dt = Joi.date();
const phone = Joi.number().min(10000000).max(9999999999).required();

const newUserValidation = (req,res,next) => {
	const schema = Joi.object({
		name: shortStr.required(),
		email: shortStr.required(),
		phone: phone,
		company: shortStr.required(),
		address: shortStr.required(),
		password: shortStr.required()
	});

	const value = schema.validate(req.body);
	if(value.error) {
        return res.json({status: 'error', message: value.error.message});
    }
    next();
}

const resetPassValidation = (req,res,next) => {
    const schema = Joi.object({email});
    const value = schema.validate(req.body);
    if(value.error) {
        return res.json({status: 'error', message: value.error.message});
    }
    next();
}

const updatePassValidation = (req,res,next) => {
    const schema = Joi.object({email, pin, newPassword});
    const value = schema.validate(req.body);
    if(value.error) {
        return res.json({status: 'error', message: value.error.message});
    }
    next();
}

const createNewTicketValidation = (req, res, next) => {
	const schema = Joi.object({
		subject: shortStr.required(),
		sender: shortStr.required(),
		message: longStr.required(),
		issueDate: dt.required(),
	});
	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}
	next();
};

const replyTicketMessageValidation = (req, res, next) => {
	const schema = Joi.object({
		sender: shortStr.required(),
		message: longStr.required(),
	});
	const value = schema.validate(req.body);
	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}

	next();
};

module.exports = {
	newUserValidation,
    resetPassValidation,
    updatePassValidation,
    createNewTicketValidation,
    replyTicketMessageValidation
};