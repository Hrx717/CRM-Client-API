const User = require('./User.schema');

const insertUser = (userobj) => {
    return new Promise((resolve, reject) => {
        new User(userobj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
}

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({email})
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

module.exports = {insertUser, getUserByEmail};