const express = require('express');
const router = express.Router();

const authValidator = require("../middleware/validation/authValidation")
const authController = require("../controller/authController")


router.get('/', (req, res) => {
    res.status(200).json({ "status": true, message: "Auth Route" });
});
router.post('/sendEmailOtp', authValidator.sendEmailOtpValidator, authController.sendEmailOtp);
router.post('/sendPhoneOtp', authValidator.sendPhoneOtpValidator, authController.sendPhoneOtp);
router.post('/signup', authValidator.signupValidator, authController.signup);
router.post('/signin', authValidator.signinValidator, authController.signin);
router.post('/forgotPassword', authValidator.forgotPasswordValidator, authController.forgotPassword);


module.exports = router;
