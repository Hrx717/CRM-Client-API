const express = require('express');
const router = express.Router();
const {verifyRefreshJWT, createAccessJWT} = require('../helper/jwt.helper');
const { getUserByEmail } = require('../model/UserModel/User.model');

//return referst jwt
router.get('/', async (req,res) => {
    const {authorization} = req.headers;
    const decoded = await verifyRefreshJWT(authorization);
    if(decoded.email) {
        const userProf = await getUserByEmail(decoded.email);
        if(userProf) {
            let tokenExp = userProf.refreshJWT.addedAt;
            const dbRefreshToken = userProf.refreshJWT.token;
            //add more time to refresh token
            tokenExp = tokenExp.setDate(tokenExp.getDate() + Number(process.env.JWT_REFRESH_SECRET_EXP_DAY));
            const today = new Date();
            if(authorization!==dbRefreshToken && tokenExp < today) {
                return res.json({status:403, message: "Signin or login again"});
            }
            const accessJWT = await createAccessJWT(userProf.email, (userProf._id).toString());
            return res.json({status: "success", message: "accesstoken created", accessJWT});
        }
    }
    return res.json({status:403, message: "Forbidden"});
})

module.exports = router;