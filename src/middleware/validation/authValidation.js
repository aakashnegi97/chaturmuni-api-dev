const { body } = require('express-validator');
const commonValidator = require('.');

const sendEmailOtpValidator = [
    body('email')
        .exists()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Please provide a valid email.'),
    commonValidator
];

const sendPhoneOtpValidator = [
    body('phone')
        .exists()
        .withMessage('Phone number is required.')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number.'),
    commonValidator
];

const signupValidator = [
    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.'),

    body('emailOtp')
        .exists().withMessage('Email OTP is required.')
        .isString().withMessage('Email OTP must be a string.')
        .isLength({ min: 6, max: 6 }).withMessage('Email OTP must be 6 characters long.'),

    body('phone')
        .exists().withMessage('Phone number is required.')
        .isMobilePhone().withMessage('Please provide a valid phone number.'),

    body('phoneOtp')
        .exists().withMessage('Phone OTP is required.')
        .isString().withMessage('Phone OTP must be a string.')
        .isLength({ min: 6, max: 6 }).withMessage('Phone OTP must be 6 characters long.'),

    body('name')
        .exists().withMessage('First name is required.')
        .isString().withMessage('First name must be a string.'),

    body('password')
        .exists().withMessage('Password is required.')
        .isString().withMessage('Password must be a string.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),

    body('address')
        .isString().withMessage('Address must be a string.'),

    body('pincode')
        .exists().withMessage('Pincode is required.')
        .isString().withMessage('Pincode must be a string.'),
    commonValidator
];

const signinValidator = [

    body('account')
        .exists().withMessage('Account field is required.'),

    body('password')
        .exists().withMessage('Password is required.')
        .isString().withMessage('Password must be a string.'),
    commonValidator
];

const forgotPasswordValidator = [

    body('email')
        .exists().withMessage('Email is required.')
        .isEmail().withMessage('Please provide a valid email address.'),

    body('emailOtp')
        .exists().withMessage('Email OTP is required.')
        .isString().withMessage('Email OTP must be a string.')
        .isLength({ min: 6, max: 6 }).withMessage('Email OTP must be 6 characters long.'),

    body('newPassword')
        .exists().withMessage('New password is required.')
        .isString().withMessage('New password must be a string.'),

    commonValidator
];

module.exports = { sendEmailOtpValidator, sendPhoneOtpValidator, signupValidator, signinValidator, forgotPasswordValidator };
