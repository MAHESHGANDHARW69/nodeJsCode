const user = require('../controllers/users.controllers');
const express = require('express');
const router = express.Router();


router.post('/userRegister', user.createUser);
router.post('/loginUser', user.loginUser);
router.post('/verify-otp', user.verifyOtp)

router.get('/loginUser', (req, res) => {
    if(req.session.isDeactivated == false){
        res.redirect('/admin')
    }else{
        res.render('login')
    }    
})
router.get('/verify-otp', (req, res) => {
    if (req.session.email) {
        res.render('verifyOtp')
    } else {
        res.redirect('/loginUser')
    }
})
router.get('/admin',(req,res)=>{
    if(req.session.isDeactivated == false){
        res.render('admin')
    }else{
        res.redirect('/loginUser')
    }
    
})
router.get('/viewUser', user.viewUsers);
router.get('/confirm/:confirmationCode', user.userVerify);



module.exports = router;