const express = require("express");
const app = express();
app.use(express.json())

// const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

// jwtKey = jwt

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
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
})
//generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id.toString() }, "mynameismaheshnodejsdevloper");
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        // console.log(token)
        return token
    } catch (error) {
        console.log(error)
    }
}
//2. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character

const User = mongoose.model('user', userSchema);

app.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).json({msg:"User Already Exist. Please Login"});
        }
        const encryptedPassword = await bcrypt.hash(password, 8);
        const userRecord = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: encryptedPassword,
        })
        const token = await userRecord.generateAuthToken();
        console.log(token)

        userRecord.save(function (err, data) {
            res.status(201).json({data:data,msg:"user registered successfully"})
        })
    } catch (err) {
        console.log("the error part")
    }
})

app.listen(8000, (err) => {
    console.log('listening port 8000')
})


 // const result = await User.insertMany([userRecord])
        // res.send(result)
        // userRecord.save().then((result)=>{
        //     // res.status(201).send(result)
        //     jwt.sign({result},jwtKey,{expiresIn:'300s'},(err,token)=>{
        //         res.status(201).send({token})
        //     })
        // }).catch((err)=>console.log(err))