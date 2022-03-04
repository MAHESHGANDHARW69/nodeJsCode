const user = require('../controllers/user.controller');
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Get Api
router.get('/', (req, res) => {
    res.render('index')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/dashboard', (req, res) => {    
    res.render('dashboard',{user:req.user})
})

// Google auth get route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        // Successful authentication, redirect success.
        res.redirect('/dashboard');
    }
);

router.get('/logout', (req, res) => {
    // req.logout()
    res.redirect('/login')
})

//facebook auth get route
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/dashboard',
        failureRedirect: '/error'
}))

// Post Api
router.post('/', user.createUser);
router.post('/login', user.userLogin);

module.exports = router;