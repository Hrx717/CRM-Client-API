const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

const setJWT = async (key, value) => {
    try {
        await client.set(key, value);
        return Promise.resolve('stored');
    }
    catch(error) {
        console.log(error);
        return Promise.resolve(error);
    }
}

const getJWT = async (key) => {
    try {
        const value = await client.get(key);
        return Promise.resolve(value);
    }
    catch(error) {
        console.log(error);
        return Promise.resolve(error);
    }
}

const deleteJWT = async (key) => {
    try {
        const value = await client.del(key);
        return Promise.resolve(value);
    }
    catch(error) {
        console.log(error);
        return Promise.resolve(error);
    }
}

module.exports = {setJWT, getJWT, deleteJWT};