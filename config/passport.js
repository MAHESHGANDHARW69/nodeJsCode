const GoogleStrategy = require('passport-google-oauth20').Strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const db = require('../models');
const User = db.users;


module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:9000/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {            
            const user = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
                email: profile.emails[0].value
            }
            try {
                let oldUser = await User.findOne({ where: { googleId:profile.id } })
                if (oldUser) {
                    console.log("User Already Exist. Please Login");
                    done(null, user)
                } else {
                    User.create(user)
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
            // userProfile = profile;
            // console.log(profile)
        }
    ));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
}