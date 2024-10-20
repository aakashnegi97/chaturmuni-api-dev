const jwt = require('jsonwebtoken');

// Secret key (make sure to keep this safe and private)

function createToken(payload, secretKey) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '15m' }); // Token expires in 15min
    return token;
}

function verifyToken(token, secretKey) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

module.exports = { createToken, verifyToken };