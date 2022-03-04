const db = require('../models');
const bcrypt = require('bcrypt');
const App = db.socials;

exports.createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body.user;
        const oldUser = await App.findOne({ where: { email } });
        if (oldUser) {
            return res.json({ error: "User Already Exist. Please Login" });
        }
        const encryptedPassword = await bcrypt.hash(password, 8);
        const user = {
            AppId:Math.random(),
            displayName: firstname,
            lastName: lastname,
            email: email,
            password: encryptedPassword,
            socialType:'system_login'
        }
        App.create(user)
            .then(data => {
                res.redirect('/login')
                console.log(data)
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

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body.user;
        const user = await App.findOne({ where: { email } });
        const isMAtch = await bcrypt.compare(password,user.password);
        if(isMAtch){
            res.redirect('/dashboard')
        }else{
            res.redirect('/login')
            console.log('===============>error')
        }
    } catch (err) {
        res.redirect("/login")
    }
}