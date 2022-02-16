const express = require("express");
const app = express();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
app.use(express.json())

dotenv.config();

//1. connection Established
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userdb")
    .then(() => console.log("connection successfully...."))
    .catch((err) => console.log(err))

//2. create document schema or docement structure and we can validate here
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    }
})

//3. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character
const User = mongoose.model('user', userSchema);

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, user.password);
        let data = {
            id:user._id,
            email:user.email
        }
        const token = await jwt.sign(data,"mynameismaheshnodejsdeveloper");
        console.log('login_token',token)

        if (isMatch) {
            res.status(200).json({email:user.email,password:user.password,auth_token:token,msg:"User LoggedIn!"});
        } else {
            res.status(404).json({error:'Invalid password Details'});
        }
    } catch (err) {
        res.status(400).json({error:"Invalid login Details"})
    }
})

app.listen(5000, (err) => {
    console.log('listening port 5000')
})