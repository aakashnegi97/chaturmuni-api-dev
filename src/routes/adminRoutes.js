const express = require('express');
const router = express.Router();

const adminValidator = require("../middleware/validation/adminValidation")
const adminController = require("../controller/adminController")
const { adminAuthMiddleware } = require("../middleware/auth/jwtTokenValidator");


router.get('/', (req, res) => {
    res.status(200).json({ "status": true, message: "Auth Route" });
});
router.post('/signin', adminValidator.signin, adminController.signin);


module.exports = router;
