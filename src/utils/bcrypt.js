const bcrypt = require('bcrypt');

const saltRounds = 10; // The cost factor (work factor)

// Hash a password
const hashPassword = async (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            resolve({ hash, success: true });
        } catch (error) {
            console.error('Error hashing password:', error);
            reject({ msg: 'Error hashing password.', success: false });
        }
    })
};


const comparePassword = async (password, hash) => {
    return new Promise(async (resolve, reject) => {
        try {
            const match = await bcrypt.compare(password, hash);
            resolve(match);
        } catch (error) {
            console.error('Error comparing password:', error);
            reject()
        }
    })
};

module.exports = { hashPassword, comparePassword }