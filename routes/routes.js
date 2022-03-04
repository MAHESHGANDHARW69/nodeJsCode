const user = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

// Get Api
router.get('/',(req,res)=>{
    res.render('index')
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/dashboard',(req,res)=>{
    res.render('dashboard')
})

// Post Api
router.post('/',user.createUser);
router.post('/login',user.userLogin);

module.exports = router;