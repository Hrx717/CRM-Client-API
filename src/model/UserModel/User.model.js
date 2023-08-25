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

const getUserById = (_id) => {
    return new Promise((resolve, reject) => {
        User.findById({_id})
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

const storeUserRefereshJWT = async (token, _id) => {
    try {
        const updated = await User.findByIdAndUpdate({_id}, 
            {'refreshJWT.token': token, 'refreshJWT.addedAt' : Date.now()}, {new: true});
        console.log(updated);
        return Promise.resolve(updated);
    }
    catch(error) {
        console.log(error);
        return Promise.reject(error);
    }
}

const updatePassword =  (email, hashedPass) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({email}, {password: hashedPass}, {new: true})
        .then((data)=>{
            console.log(data);
            resolve(data);
        })
        .catch((err)=>{
            reject(err);
        });
    });
}

module.exports = {
    insertUser, 
    getUserByEmail,
    getUserById,
    storeUserRefereshJWT,
    updatePassword
};