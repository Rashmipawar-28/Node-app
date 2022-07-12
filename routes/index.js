const express = require('express');
const router = express.Router();
const user = require('../controllers/userController')

router.get('/testGet', user.authorization ,user.getUsers)
router.post('/register', user.register)
router.post('/login', user.login)
router.post('/logout', user.logout)
router.post('/sendPhoneOtp', user.sendPhoneOtp)
router.post('/verifyPhoneOtp', user.verifyPhoneOtp)
router.post('/sendEmailOtp', user.sendEmailOtp)
router.post('/verifyEmailOtp', user.verifyEmailOtp)
module.exports = router;