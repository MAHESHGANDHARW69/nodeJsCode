const express = require('express');
const passport = require('passport');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index') //load index.ejs file
})

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile',{user:req.user}) //load profile.ejs file
    // res.send('Successfully Login!!!')
})

router.get('/error', isLoggedIn,(req, res) => {
    // res.render('pages/error.ejs');    
});

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/error'
    }))

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;

