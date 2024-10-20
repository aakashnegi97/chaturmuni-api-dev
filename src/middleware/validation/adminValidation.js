const { body } = require('express-validator');
const commonValidator = require('.');

const signin = [
    body('adminName')
        .exists().withMessage('Account field is required.'),

    body('adminPassword')
        .exists().withMessage('Password is required.')
        .isString().withMessage('Password must be a string.'),

    commonValidator
];

module.exports = { signin };
