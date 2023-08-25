const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kayla62@ethereal.email',
        pass: 'CxfQDpd39YJ8Kwrv24'
    }
});

const send = (info) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await transporter.sendMail(info);
            console.log("Message sent: %s", result.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            resolve(result);
        }
        catch(error) {
            console.log(error);
            reject(error);
        }
    })
}

const emailProcessor = async ({email, pin, type}) => {
    if(type === 'request-new-password') {
        const info = {
            from: '"crm-Company,"kayla62@ethereal.email', // sender address
            to: email, // list of receivers
            subject: "Password reset pin", // Subject line
            text: "This is your one-time pin to reset your password " + pin +
            " expires in 5minutes", // plain text body
            html: `<b>Hello, </b>
            Here is your pin
            <b>${pin} </b>
            This pin is valid for 5minutes`, // html body
        }
        return await send(info);
    }
    else if(type === 'password-update-success') {
        const info = {
            from: '"crm-Company,"kayla62@ethereal.email', // sender address
            to: email, // list of receivers
            subject: "Passwod Updated", // Subject line
            text: "Your new password has been updated", // plain text body
            html: `<b>Hello, </b>
            Your new password has been updated`, // html body
        }
        return await send(info);
    }
}

module.exports = {emailProcessor};