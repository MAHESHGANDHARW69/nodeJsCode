const db = require("../models");
const bcrypt = require("bcrypt");
// require("dotenv").config()
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User = db.users;

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'mahesh.thoughtwin@gmail.com',
        pass:'mahesh12345'
    }
});

var mailOptions = {
    from:'mahesh.thoughtwin@gmail.com',
    to:'mahesh.thoughtwin@gmail.com',
    subject:'Nodemailer Email Test Module',
    text:'You have been Registered Successfully!please login now!'        
};


exports.createUser = async (req, res) => {
    console.log('================>', req.body)
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
    User.create(user)
        .then(data => {
            res.status(201).json({ data: data, msg: "User Registered successfully" })
            transporter.sendMail(mailOptions,(error,info)=>{
                console.log('You have been Registered Successfully' + info.response);
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal Server Error,"
            });
        })
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('////////////////', isMatch)
        let data = {
            id: user.id,
            email: user.email
        }
        const token = await jwt.sign(data, "mynameismaheshnodejsdevloper");
        console.log(token)
        if (isMatch) {
            res.status(200).json({ email: user.email, password: user.password, auth_token: token, msg: "User LoggedIn!" });
        } else {
            res.status(404).json({ error: 'Invalid password Details' });
        }
    } catch (err) {
        res.status(400).json({ error: "Invalid login Details" })
    }
}

exports.changePasswordUser = async (req, res) => {
    try {
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, "mynameismaheshnodejsdevloper");
        var userId = decoded.id
        const salt = await bcrypt.genSalt(8);
        const password = await bcrypt.hash(req.body.password, salt);
        const id = await User.findOne({ where: { id: userId } }).then((user) => {
            user.update({ password: password }).then((user) => {
                res.status(200).json({ data: user, msg: "Changed password successfully" })
            })
        });
    } catch (err) {
        res.status(404).send("Invalid token")
    }
}

exports.getUserInfo = async (req, res) => {
    try {
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
        var decoded = jwt.verify(onlyToken, "mynameismaheshnodejsdevloper");
        var userId = decoded.id
        const encryptedPassword = await bcrypt.hash(password, 8);
        let user = await User.findOne({ where: { id: userId } }).then((user) => {
            user.update({
                first_name: first_name,
                last_name: last_name,
                email: email,
                gender: gender,
                password: encryptedPassword
            }).then((user) => {
                res.status(200).json({ data: user, msg: "Profile Updated successfully" })
            })
        })
    } catch (err) {
        res.status(404).send("Invalid token")
    }
}

exports.deleteUserDetails = async (req, res) => {
    try {
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, "mynameismaheshnodejsdevloper");
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
        res.status(404).send('Invalid token');
    }
}
