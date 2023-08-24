//bcrypt
const bcryptjs = require('bcryptjs');
//hashPassword to save in db
const hashPassword = async (plainPassword) => {
    const newPassword = await bcryptjs.hash(plainPassword, 10);
    return newPassword;
}
//compare dbhasPassword
const comparePassword = (plainPassword, hashedPass) => {
    return new Promise((resolve, reject) => {
        bcryptjs.compare(plainPassword, hashedPass, (err, res) => {
            if (err){
                reject(err);
            }
            resolve(res);
        });
    });
}

module.exports = {hashPassword, comparePassword};