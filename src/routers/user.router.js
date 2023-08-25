const express = require('express');
const router = express.Router();
const {insertUser, getUserByEmail,getUserById} = require('../model/UserModel/User.model');
const {hashPassword, comparePassword} = require('../helper/bcrypt.helper');
const {createAccessJWT, createRefreshJWT} = require('../helper/jwt.helper');
const {userAuthorization} = require('../middlewares/authorization.middleware');
const { setPasswordResetPin } = require('../model/ResetPinModel/ResetPin.model');

//routers
router.get('/', userAuthorization, async (req,res) => {
    console.log(req.userId);
    const _id = req.userId;
    const user = await getUserById(_id);
    res.json({message: "return from user-router", user});
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
        
        const accessJWT = await createAccessJWT(result.email, `${result._id}`);
        const refreshJWT = await createRefreshJWT(result.email,`${result._id}`);
        res.json({status:'success', message:'login succesfuly', accessJWT: accessJWT,refreshJWT: refreshJWT});
    }
    catch(error) {
        console.log('error->', error.message);
        res.json({status: 'error', message: error.message});
    }
});

//reset password
router.post('/reset-password', async (req,res) => {
    const {email} = req.body;
    const user = await getUserByEmail(email);
    if(user && user._id) {
        const savepin = await setPasswordResetPin(email);
        return res.json({message:'saved', savepin});
    }

    return res.json({status:'error', message: 'user not found'});
});

module.exports = router;