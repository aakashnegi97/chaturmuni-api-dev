const express = require('express');
const router = express.Router();

const userValidator = require("../middleware/validation/userValidation")
const userController = require("../controller/userController")
const { userAuthMiddleware } = require("../middleware/auth/jwtTokenValidator");


router.get('/', (req, res) => {
    res.status(200).json({ "status": true, message: "Auth Route" });
});
router.post('/isLogin', userAuthMiddleware, userController.isLogin);
router.post('/refreshToken', userAuthMiddleware, userController.refreshToken);
router.post('/resetPassword', userAuthMiddleware, userValidator.resetPasswordValidator, userController.resetPassword);


module.exports = router;
