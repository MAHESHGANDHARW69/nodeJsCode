const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let nodemailer = require("nodemailer");
const crypto = require('crypto');
const otpGenearator = require('otp-generator');
require('dotenv').config();
const { sendSms, sendOtpVerfiy } = require('../utils/verifyOtp');
const { emailVerfiyToken, emailVerfiyOtp, approvedUserEmail } = require('../utils/verifyEmail');

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
        const OTP = otpGenearator.generate(4, {
            lowerCaseAlphabets: false,
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
        })
        console.log('before===========>', OTP)
        // const OTP = Math.floor((Math.random()*1000000)+1);                    
        // console.log('=======>token', OTP)
        // const salt = await bcrypt.genSalt(10);
        // const otp = await bcrypt.hash(OTP,salt)        

        const encryptedPassword = await bcrypt.hash(password, 8);
        const encryptedOtp = await bcrypt.hash(OTP, 8)
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
            resetToken: encryptedOtp,
        }
        console.log("======================", User)
        User.create(user)
            .then(data => {
                res.status(201).json({ data: data, msg: "otp sent successfully" })
                // emailVerfiyToken(email, Token);
                // emailVerfiyOtp(email, Token)
                // sendOtpVerfiy(phone);
                sendSms(phone, OTP)
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

        const { email, password } = req.body.user;
        const user = await User.findOne({ where: { email } });
        if (!user) return next(new Error('Email does not exist'));
        const isMatch = await bcrypt.compare(password, user.password);
        const OTP = otpGenearator.generate(4, {
            lowerCaseAlphabets: false,
            digits: true,
            upperCaseAlphabets: false,
            specialChars: false,
        })
        const encryptedOtp = await bcrypt.hash(OTP, 8)
        const sess = req.session;
        if (isMatch) {
            sess.email = user.email;
            sess.save();
            console.log('session storage======>', sess)
            User.findByPk(user.id).then((user) => {
                User.update({ resetToken: encryptedOtp }, { where: { id: user.id } });
            })
            sendSms(user.phone, OTP)
            // res.status(200).json({ email: email, msg: "User LoggedIn!" });
            res.redirect('/verify-otp')
        } else {
            // res.status(404).json({ error: 'Invalid password Details' });
            res.redirect('/loginUser')
        }
    } catch (err) {
        res.status(400).json({ error: err })
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


//user verification using email sending by jwt token
// exports.userVerify = async (req, res) => {
//     try {
//         const confirmationCode = req.params.confirmationCode
//         var decodedEmail = await jwt.verify(confirmationCode, process.env.JWT_SECRET, { expiresIn: "15m" });
//         const user = await User.findOne({ where: { email: decodedEmail } })
//         if (user) {
//             User.findByPk(user.id).then((user) => {
//                 User.update({ isVarified: true,resetToken: null }, { where: { id: user.id } })
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
                User.update({ isVarified: true, resetToken: null }, { where: { id: user.id } })
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

//verify Otp using phone number in twilio

// exports.verifyOtp = async (req, res) => {
//     try {
//         const { phone, otp } = req.body;
//         const user = await User.findOne({ where: { phone: phone } });
//         const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//         const check = await client.verify.services(process.env.VERIFY_SERVICE_SID)
//             .verificationChecks
//             .create({ to: `+91${phone}`, code: otp })
//         if (user) {
//             User.findByPk(user.id).then((user) => {
//                 User.update({ isVarified: true,resetToken: null }, { where: { id: user.id } })
//                 console.log('You have been verified successfully!!')
//                 res.status(200).send(check);
//             })
//                 .catch(e => {
//                     console.log(e)
//                     res.status(500).send(e);
//                 });

//         }
//     } catch (err) {
//         res.json({ err: err })
//     }
// }

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body.user;
        const user = await User.findOne({ where: { phone: phone } });
        const isMatch = await bcrypt.compare(otp, user.resetToken);
        console.log(isMatch)
        const msg = "You have been verified successfully!!"
        if (isMatch) {
            req.session.isDeactivated = false;
            User.findByPk(user.id).then((user) => {
                User.update({ isDeactivated: false, isVarified: true, resetToken: null }, { where: { id: user.id } })
                console.log('You have been verified successfully!!')
                // res.status(200).json({ isVarified: isMatch, msg: msg });
                res.redirect('/admin')
                sendSms(phone, msg)
            })
                .catch(e => {
                    console.log(e)
                    res.status(500).send(e);
                });
        } else {
            res.status(500).send("otp is not matched");
        }
    } catch (err) {
        res.json({ err: "otp expired" })
    }
}

exports.viewSeller = async (req, res) => {
    try {
        let userInfo = await User.findAll({ where: { userType: 'seller' } });
        return userInfo;
    } catch (err) {
        res.send(err)
    }
}

exports.approveSeller = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        User.findByPk(user.id).then((user) => {
            User.update({ isApproved:true }, { where: { id: user.id } })            
        })
        let result =  await approvedUserEmail(email)
        res.status(201).send(result)
    } catch (err) {
        console.log(err)
    }
}