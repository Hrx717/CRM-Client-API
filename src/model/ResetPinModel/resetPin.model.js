const ResetPin = require('./resetPin.schema');

const createRandomPin = (length) => {
    let pin = '';
    for(let i=0;i<length;i++) {
        pin += Math.floor(Math.random() * 10);
    }
    return pin;
}

const setPasswordResetPin = (email) => {
    const pin = createRandomPin(6);
    const userobj = {email, pin}
    return new Promise((resolve, reject) => {
        new ResetPin(userobj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
}

module.exports = {
    setPasswordResetPin
};