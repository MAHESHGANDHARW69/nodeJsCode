const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { createEmailSender } = require("./emailSender")
const User = db.users;
const Employee = db.employees;
let refreshTokens = [];

exports.createUser = async (req, res) => {
    try {
        console.log('================>', req.body)
        const t = await db.sequelize.transaction();//Transaction handle
        const { first_name, last_name, email, gender, password } = req.body;
        const oldUser = await User.findOne({ where: { email } })
        if (oldUser) {
            return res.status(409).json({ msg: "User Already Exist. Please Login" });
        }
        const encryptedPassword = await bcrypt.hash(password, 8);
        const user = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            gender: gender,
            password: encryptedPassword
        }
        const success = "User Registered successfully!";
        const subject = "Registered User App";
        User.create(user, { transaction: t })
            .then(data => {
                res.status(201).json({ data: data, msg: success })
                createEmailSender(email, subject, success);
                console.log("commit");
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal Server Error,"
                });
            })
        Employee.create(user, { transaction: t })
            .then(data => {
                res.status(201).json({ data: data, msg: success })
                createEmailSender(email, subject, success);
                console.log("commit");
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal Server Error,"
                });
                console.log("rollback")
            })
        t.commit()
    } catch (err) {
        res.send(err);
        t.rollback();
    }
}

exports.loginUser = async (req, res) => {
    try {
        const t = await db.sequelize.transaction();
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        const isMatch = await bcrypt.compare(password, user.password);
        let data = {
            id: user.id,
            email: user.email
        }
        // const access_token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "20s" });
        // const refresh_token = await jwt.sign({ data, refresh: true }, process.env.JWT_SECRET, { expiresIn: "7 days" });
        const access_token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "8h" });
        const refresh_token = await jwt.sign({ data, refresh: true }, process.env.JWT_REFRESH, { expiresIn: "7 days" });
        refreshTokens.push(refresh_token);
        if (isMatch) {            
            res.status(200).json({ email: user.email, password: user.password, access_token, refresh_token, msg: "User LoggedIn!" });
            console.log("commited Logged")
        } else {            
            res.status(404).json({ error: 'Invalid password Details' });
            console.log("error is rolling")
        }
    } catch (err) {
        res.status(400).json({ error: "Invalid login Details" })
    }
}

exports.changePasswordUser = async (req, res) => {
    try {
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
        console.log(decoded)
        var userId = decoded.id
        console.log(userId)
        const salt = await bcrypt.genSalt(8);
        const password = await bcrypt.hash(req.body.password, salt);
        const success = "Changed password successfully!";
        const subject = "Change password user App";
        const id = await User.findOne({ where: { id: userId } }).then((user) => {
            user.update({ password: password }).then((user) => {
                res.status(200).json({ data: user, msg: "Changed password successfully" })
                createEmailSender(decoded.email, subject, success)
            })
        });
    } catch (err) {
        res.status(404).send("Unauthorized access")
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        const t = await db.sequelize.transaction();
        let user = await User.findAll();
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(400).send(err);
    }
}

exports.updateProfileUsers = async (req, res) => {
    try {
        const { first_name, last_name, email, gender, password } = req.body;
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
        var userId = decoded.id
        const encryptedPassword = await bcrypt.hash(password, 8);
        const success = "Profile Updated successfully!";
        const subject = "Update user profile App";
        let user = await User.findOne({ where: { id: userId } }).then((user) => {
            user.update({
                first_name: first_name,
                last_name: last_name,
                // email: email,
                gender: gender,
                password: encryptedPassword
            }).then((user) => {
                res.status(200).json({ data: user, msg: "Profile Updated successfully" })
                createEmailSender(decoded.email, subject, success)
            })
        })
    } catch (err) {
        res.status(404).send("Unauthorized access.")
    }
}

exports.deleteUserDetails = async (req, res) => {
    try {
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
        var userId = decoded.id
        let user = await User.destroy({ where: { id: userId } }).then((user) => {
            if (user) {
                res.json({ msg: "User was delete successfully!" })
            } else {
                res.send({
                    message: `Cannot delete with id=${id}`,
                });
            }
        })
    } catch (err) {
        res.status(404).send('Unauthorized access.');
    }
}

exports.renewAccessToken = async (req, res) => {
    try {
        let refreshToken = req.headers.authorization;
        // console.log(refreshToken)
        // res.send(refreshToken)
        if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ msg: 'User not authorized' })
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
            if (!err) {
                const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "20s" });
                return res.status(201).json({ accessToken })
            } else {
                return res.status(403).json({ msg: 'User not authorized1' })
            }
        })
    } catch (err) {

    }
}