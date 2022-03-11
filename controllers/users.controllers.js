const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { createEmailSender } = require('../utils/verifyEmail')

const User = db.User;

exports.createUser = async (req, res) => {
    try {
        const { userType, profilePhoto, firstName, lastName, phone, email, password, isDeactivated, isVarified } = req.body;
        const oldUser = await User.findOne({ where: { email } })
        if (oldUser) {
            return res.status(400).json({ error: "Email already there, No need to register again." });
        }
        const Token = await jwt.sign(email, process.env.JWT_SECRET)
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
                res.status(201).json({ data: data })
                createEmailSender(firstName, email, Token);
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

exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return next(new Error('Email does not exist'));
        const isMatch = await bcrypt.compare(password, user.password);
        const data = {
            id: user.id,
            email: user.email
        }
        const accessToken = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1D' })
        const resetToken = await jwt.sign(data, process.env.JWT_REFRESH, { expiresIn: '7 days' });
        if (isMatch && user.userType == "admin") {
            User.findByPk(user.id).then((user) => {
                User.update({ isDeactivated: false, resetToken: resetToken }, { where: { id: user.id } })
            })
            res.status(200).json({ email: user.email, password: user.password, accessToken, resetToken, msg: "User LoggedIn!" });
        } else {
            res.status(404).json({ error: 'Invalid password Details' });
        }
    } catch (err) {
        res.status(400).json({ error: "Invalid login Details" })
    }
}
exports.loginSeller = async (req, res, next) => {
    try {
        // let token = req.headers.authorization;
        // let onlyToken = token.split(' ')[1]
        // var decoded = await jwt.verify(onlyToken, process.env.JWT_SECRET);
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return next(new Error('Email does not exist'));
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch && user.userType == 'seller') {
            User.findByPk(user.id).then((user) => {
                User.update({ isDeactivated: false, resetToken: onlyToken }, { where: { id: user.id } })
            })
            res.status(200).json({ email: user.email, password: user.password, msg: "User LoggedIn!" });
        } else {
            res.status(404).json({ error: 'Invalid password Details' });
        }
    } catch (err) {
        res.json({ msg: "unauthorized token" })
    }
}

exports.viewUsers = async (req, res) => {
    try {
        let user = await User.findAll({ where: { userType: 'seller' } });
        console.log(user)
        res.status(300).json({ data: user })
    } catch (err) {
        res.send(err)
    }
}

exports.userVerify = async (req, res) => {
    try {
        const confirmationCode = req.params.confirmationCode
        var decodedEmail = await jwt.verify(confirmationCode, process.env.JWT_SECRET, { expiresIn: "15m" });
        const user = await User.findOne({ where: { email: decodedEmail } })
        if (user) {
            User.findByPk(user.id).then((user) => {
                User.update({ isVarified: true }, { where: { id: user.id } })
                console.log('You have been verified successfully!!')
                res.send("You have been verified")
            })
        } else {
            console.log("User Not found")
        }
    } catch (err) {
        res.send(err)
    }
}

