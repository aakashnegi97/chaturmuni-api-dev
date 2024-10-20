const express = require('express');
const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Use user routes
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/admin', adminRoutes);


module.exports = router;