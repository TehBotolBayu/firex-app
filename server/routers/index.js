const express = require('express');
const app = express();
const router = express.Router(),
userRouter = require('./user'),
sensorRouter = require('./sensor'),
emergencyRouter = require('./emergency');
authRouter = require('./auth');

router.use('/user', userRouter);
router.use('/sensor', sensorRouter);
router.use('/emergency', emergencyRouter);
router.use('/auth', authRouter);

module.exports = router;
