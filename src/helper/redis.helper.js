const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

const setJWT = async (key, value) => {
    await client.connect();
    try {
        await client.set(key, value);
    }
    catch(error) {
        console.log(error);
    }
}

const getJWT = (key) => {
    return new Promise((resolve, reject) => {
        try {
            const value = client.get(key, (err, res) => {
                if(err) reject(err);
                resolve(res);
            });
        }
        catch(error) {
            reject(error);
        }
    });
}

module.exports = {setJWT, getJWT};