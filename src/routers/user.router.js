const express = require('express');
const router = express.Router();
const {insertUser, getUserByEmail} = require('../model/UserModel/User.model');

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

//routers
router.get('/', (req,res) => {
    res.json({message: "return from user-router"})
});

//sign-up(new user) router
router.post('/', async (req,res) => {
    const {name, company, address, phone, email, password} = req.body;
    try {
        const hashedPass = await hashPassword(password);
        const newUserObj = {
            name, company, address, phone, email,
            password: hashedPass
        }
        const result = await insertUser(newUserObj);
        console.log('user saved-', result);
        res.json({message: 'new user created', result});
    }
    catch(error) {
        console.log('error->', error.message);
        res.json({status: 'error', message: error.message});
    }
});

//sign-in(login) router
router.post('/login', async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.json({status: 'error', message: 'Invalid form submission!'});
    }
    //find email in db
    try {
        const result = await getUserByEmail(email);
        if(result==null) {
            return res.json({message: 'Invalid email or Password!'})
        }
        const passFromDb = result.password;
        const cmpresult = await comparePassword(password, passFromDb);
        console.log(cmpresult);
        res.json({message: 'user exists', result});
    }
    catch(error) {
        console.log('error->', error.message);
        res.json({status: 'error', message: error.message});
    }
});

module.exports = router;