const { body } = require('express-validator');
const commonValidator = require('.');

const resetPasswordValidator = [
    body('newPassword')
        .exists().withMessage('New password is required.')
        .isString().withMessage('New password must be a string.'),

    commonValidator
];

module.exports = { resetPasswordValidator };
