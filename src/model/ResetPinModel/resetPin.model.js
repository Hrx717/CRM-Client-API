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

const getPinByEmailPin = (email, pin) => {
    return new Promise((resolve, reject) => {
        ResetPin.findOne({email, pin})
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

const deletePin = (email, pin) => {
    ResetPin.findOneAndDelete({email, pin})
    .then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    });
}

module.exports = {
    setPasswordResetPin,
    getPinByEmailPin,
    deletePin
};