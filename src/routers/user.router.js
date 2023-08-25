const express = require('express');
const router = express.Router();
const {insertUser, getUserByEmail,getUserById, updatePassword} = require('../model/UserModel/User.model');
const {hashPassword, comparePassword} = require('../helper/bcrypt.helper');
const {createAccessJWT, createRefreshJWT} = require('../helper/jwt.helper');
const {userAuthorization} = require('../middlewares/authorization.middleware');
const { setPasswordResetPin, getPinByEmailPin, deletePin } = require('../model/ResetPinModel/ResetPin.model');
const { emailProcessor } = require('../helper/email.helper');

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

//reset password - check email, create pin and mail pin..
router.post('/reset-password', async (req,res) => {
    const {email} = req.body;
    const user = await getUserByEmail(email);
    if(user && user._id) {
        //set and save pin to bd
        const setPin = await setPasswordResetPin(email);
        //send pin using mail to user
        const sendMail = await emailProcessor({email, pin:setPin.pin,type:'request-new-password'});
        if(sendMail) {
            return res.json({status: 'success', 
            message: 'The password reset pin will sent shortly to registered mail id.'});
        }
    }

    return res.json({status:'error', message: 'user not found'});
});

//reset password - save new password to db
router.patch('/reset-password', async (req,res) => {
    const {email, pin, newPassword} = req.body;
    const getPin = await getPinByEmailPin(email, pin);
    if(getPin) {
        const dbDate = getPin.addedAt;
        const expiresIn = 5;
        const expDate = dbDate.setDate(dbDate.getMinutes() + expiresIn);
        const today = new Date();
        if(today > expDate) {
            return res.json({message: 'Invalid or expired pin, request new pin to change password'});
        }

        const hashedPass = await hashPassword(newPassword);
        const result = await updatePassword(email, hashedPass);
        if(result) {
            //send password updated mail
            await emailProcessor({email, type:'password-update-success'});
            //delete the pin form db so that it cannot reused
            await deletePin(email, pin);

            return res.json({status: 'success', message: 'Password Changed'});
        }
    }

    return res.json({status: 'error', message: 'Somthing went wrong, Try again later'});
});

module.exports = router;