const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json())

//1. connection Established

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userdb")
    .then(() => console.log("database connected successfully...."))
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

//2. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character
const User = mongoose.model('user', userSchema);

app.post("/changepassword",async (req,res)=>{
    try{
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var docoded = jwt.verify(onlyToken,"mynameismaheshnodejsdevloper");
        var userId = docoded._id
        console.log(docoded._id)
        const salt = await bcrypt.genSalt(8);
        const password = await bcrypt.hash(req.body.password,salt);
        const userPassword = await User.findByIdAndUpdate({_id:userId},{password:password},{new:true});
        res.status(200).json({data:userPassword.password,msg:"Changed password successfully"})
    }catch(error){
        res.status(404).send("Invalid token")
    }
})

app.listen(4000, (err) => {
    console.log("Application running on 4000")
})