const jwt = require('jsonwebtoken');
const {setJWT, getJWT} = require('./redis.helper');
const {storeUserRefereshJWT} = require('../model/UserModel/User.model');

const createAccessJWT = async (email, _id) => {
    try {
      const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1d",
      });

      await setJWT(accessJWT, _id);
      return Promise.resolve(accessJWT);
    } 
    catch (error) {
      return Promise.reject(error);
    }
};

const createRefreshJWT = async (email, _id) => {
    try {
      const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
      });

      await storeUserRefereshJWT(refreshJWT, _id);
      return Promise.resolve(refreshJWT);
    } 
    catch (error) {
      return Promise.reject(error);
    }
};

const verifyAccessJWT = (userJWT) => {
    try {
      return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET));
    }
    catch(error) {
      return Promise.resolve(error);
    }
}

const verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET));
  }
  catch(error) {
    return Promise.resolve(error);
  }
}

module.exports = {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT
};