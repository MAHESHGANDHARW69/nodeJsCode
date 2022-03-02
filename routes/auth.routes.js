const express = require('express');
const passport = require('passport');
const data = require('../config/passport')

const authRoute = express.Router();


authRoute.get('/', (req, res) => {
    res.render('login')
})
authRoute.get('/success', (req, res) => {
    res.render('index',{userinfo:req})
})

authRoute.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoute.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        // Successful authentication, redirect success.
        res.redirect('/success');
    }
);

authRoute.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = authRoute;