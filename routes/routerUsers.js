const user = require('../controllers/users.controllers');
const express = require('express');
const router = express.Router();


router.post('/userRegister',user.createUser);
router.post('/loginAdmin',user.loginUser);
router.post('/verify-otp',user.verifyOtp)

router.get('/viewUser',user.viewUsers);
router.get('/confirm/:confirmationCode',user.userVerify);



module.exports = router;