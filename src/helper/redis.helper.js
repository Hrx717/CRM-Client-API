const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

const setJWT = async (key, value) => {
    await client.connect();
    try {
        await client.set(key, value);
        await client.disconnect();
        return Promise.resolve('stored');
    }
    catch(error) {
        console.log(error);
        await client.disconnect();
        return Promise.resolve(error);
    }
}

const getJWT = async (key) => {
    await client.connect();
    try {
        const value = await client.get(key);
        await client.disconnect();
        return Promise.resolve(value);
    }
    catch(error) {
        console.log(error);
        await client.disconnect();
        return Promise.resolve(error);
    }
}

const deleteJWT = async (key) => {
    await client.connect();
    try {
        const value = await client.del(key);
        await client.disconnect();
        return Promise.resolve(value);
    }
    catch(error) {
        console.log(error);
        await client.disconnect();
        return Promise.resolve(error);
    }
}

module.exports = {setJWT, getJWT, deleteJWT};