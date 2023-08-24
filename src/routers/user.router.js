const express = require('express');
const router = express.Router();
const {insertUser, getUserByEmail} = require('../model/UserModel/User.model');
const {hashPassword, comparePassword} = require('../helper/bcrypt.helper');
const {crateAccessJWT, crateRefreshJWT} = require('../helper/jwt.helper');

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
            return res.json({message: 'Invalid email or Password!'});
        }
        const passFromDb = result.password;
        const cmpresult = await comparePassword(password, passFromDb);
        console.log(cmpresult);
        if(!cmpresult) {
            return res.json({message: 'Invalid email or Password!'});
        }
        
        const accessJWT = await crateAccessJWT(result.email, `${result._id}`);
        const refreshJWT = await crateRefreshJWT(result.email);
        res.json({status:'success', message:'login succesfuly', accessJWT: accessJWT});
    }
    catch(error) {
        console.log('error->', error.message);
        res.json({status: 'error', message: error.message});
    }
});

module.exports = router;