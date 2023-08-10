const jwt = require('jsonwebtoken');

const createJSONWebToken = (payload, secretKey, expiresIn) =>{
    if(typeof payload !== 'object' || !payload){
        throw new Error('Payload must be non empty object')
    }

    if(typeof secretKey !== 'string' || secretKey === ''){
        throw new Error('SecretKey must be non empty object');
    }
    try {
        const token = jwt.sign(payload, secretKey, {expiresIn});
        return token;
    } catch (error) {
        console.error('JWT failed', error);
        throw error;
    }
}

module.exports = {createJSONWebToken}