const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const otpGenearator = require('otp-generator');
require('dotenv').config();
const { createEmailSender, sendOtpVerfiy } = require('../utils/verifyOtp')

const User = db.User;



exports.createUser = async (req, res) => {
    try {
        const { userType, profilePhoto, firstName, lastName, phone, email, password, isDeactivated, isVarified } = req.body;
        const oldUser = await User.findOne({ where: { email } })
        if (oldUser) {
            return res.status(400).json({ error: "Email already there, No need to register again." });
        }
        const number = await User.findOne({ where: { phone } });
        if (number) return res.status(400).json({ error: "User already there, No need to register again." });
        //jwt generate token
        // const Token = await jwt.sign(email, process.env.JWT_SECRET)

        //crypto generate token
        const Token = crypto.createHmac('sha256', process.env.JWT_SECRET)
            .update("thisissecret")
            .digest('hex');

        //OTP generate
        const OTP = otpGenearator.generate(6, {
            lowerCaseAlphabets: false,
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false
        })
        console.log(OTP)
        // const OTP = Math.floor((Math.random()*1000000)+1);                    
        // console.log('=======>token', OTP)
        // const salt = await bcrypt.genSalt(10);
        // const otp = await bcrypt.hash(OTP,salt)        

        const encryptedPassword = await bcrypt.hash(password, 8);
        const user = {
            userType: userType,
            profilePhoto: profilePhoto,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: encryptedPassword,
            isDeactivated: isDeactivated,
            isVarified: isVarified,
            resetToken: Token,
        }
        console.log("======================", User)
        User.create(user)
            .then(data => {
                res.status(201).json({ data: data, msg: "otp sent successfully" })
                // createEmailSender(email,OTP, Token);
                sendOtpVerfiy(phone);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal Server Error,"
                });
            })
    } catch (err) {
        res.send(err)
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return next(new Error('Email does not exist'));
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch && user.userType == "admin") {
            User.findByPk(user.id).then((user) => {
                User.update({ isDeactivated: false }, { where: { id: user.id } })
            })
            res.status(200).json({ email: user.email, password: user.password, accessToken, resetToken, msg: "User LoggedIn!" });
        } else {
            res.status(404).json({ error: 'Invalid password Details' });
        }
    } catch (err) {
        res.status(400).json({ error: "Invalid login Details" })
    }
}
// exports.loginSeller = async (req, res, next) => {
//     try {

//         const { email, password } = req.body;
//         const user = await User.findOne({ where: { email } });
//         if (!user) return next(new Error('Email does not exist'));
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch && user.userType == 'seller') {
//             User.findByPk(user.id).then((user) => {
//                 User.update({ isDeactivated: false, resetToken: onlyToken }, { where: { id: user.id } })
//             })
//             res.status(200).json({ email: user.email, password: user.password, msg: "User LoggedIn!" });
//         } else {
//             res.status(404).json({ error: 'Invalid password Details' });
//         }
//     } catch (err) {
//         res.json({ msg: "unauthorized token" })
//     }
// }

exports.viewUsers = async (req, res) => {
    try {
        let user = await User.findAll({ where: { userType: 'seller' } });
        console.log(user)
        res.status(300).json({ data: user })
    } catch (err) {
        res.send(err)
    }
}

//user verification using email sending by jwt token
// exports.userVerify = async (req, res) => {
//     try {
//         const confirmationCode = req.params.confirmationCode
//         var decodedEmail = await jwt.verify(confirmationCode, process.env.JWT_SECRET, { expiresIn: "15m" });
//         const user = await User.findOne({ where: { email: decodedEmail } })
//         if (user) {
//             User.findByPk(user.id).then((user) => {
//                 User.update({ isVarified: true }, { where: { id: user.id } })
//                 console.log('You have been verified successfully!!')
//                 res.send("You have been verified")
//             })
//         } else {
//             console.log("User Not found")
//         }
//     } catch (err) {
//         res.send(err)
//     }
// }

//user verification using email sending by crypto token
exports.userVerify = async (req, res) => {
    try {
        const confirmationCode = req.params.confirmationCode
        const user = await User.findOne({ where: { resetToken: confirmationCode } })
        console.log(user)
        if (user) {
            User.findByPk(user.id).then((user) => {
                User.update({ isVarified: true }, { where: { id: user.id } })
                console.log('You have been verified successfully!!')
                res.status(200).json({ success: "You have been verified" })
            })
        } else {
            console.log("User Not found")
        }
    } catch (err) {
        res.send(err)
    }
}

//verify Otp using phone number

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ where: { phone: phone } });
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const check = await client.verify.services(process.env.VERIFY_SERVICE_SID)
            .verificationChecks
            .create({ to: `+91${phone}`, code: otp })
            if(user){
                User.findByPk(user.id).then((user) => {
                    User.update({ isVarified: true }, { where: { id: user.id } })
                    console.log('You have been verified successfully!!')
                    res.status(200).send(check);
                })
                .catch(e => {
                    console.log(e)
                    res.status(500).send(e);
                });

            }       
    } catch (err) {
        res.json({ err: err })
    }
}