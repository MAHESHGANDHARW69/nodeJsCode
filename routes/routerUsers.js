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
router.get('/admin',async(req,res)=>{
    const users = await user.viewSeller();
    // if(req.session.isDeactivated == false){        
        res.render('index',{users})
    // }else{
        // res.redirect('/loginUser')
    // }
    
})
router.get('/logout',(req,res)=>{    
    req.session.destroy();
    res.redirect('/loginUser')
})
// router.get('/view-seller', user.viewSeller);
router.get('/confirm/:confirmationCode', user.userVerify);

router.post('/userSellerApproved',user.approveSeller);

module.exports = router;