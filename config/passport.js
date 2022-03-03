const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const db = require('../models');
const Fabo = db.facebooks;

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: APP_ID,
        clientSecret: APP_SECRET,
        callbackURL: 'http://localhost:3000/facebook/callback'
    }, 
    async (accessToken, refreshToken, profile, done) =>{
        console.log(profile)  
        const fabo = {
            facebookId:profile.id,
            displayName:profile.displayName
        }
        try {
            let oldUser = await Fabo.findOne({ where: { facebookId:profile.id } })
            if (oldUser) {
                console.log("User Already Exist. Please Login");
                done(null, fabo)                
            } else {
                Fabo.create(fabo)
                    .then(data => {
                        // res.send({ msg: "User Registered successfully!" })
                        console.log("User Registered successfully!")                        
                    })
                    .catch(err => {
                        console.log("internal error")
                    })
            }
        } catch (err) {
            console.log(err)
        }   
        return done(null, profile);     
    }
    ));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
}