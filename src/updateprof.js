const express = require("express");
const app = express();
// const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
app.use(express.json())

// dotenv.config();

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

//generating token
userSchema.methods.generateAuthToken = function () {
    try {
        console.log(this._id)
        const token = jwt.sign({ _id: this._id }, "mynameismaheshnodejsdevloper");
        // const usersToken = jwt.verify(token,"mynameismaheshnodejsdevloper");
        return token
    } catch (error) {
        console.log(error)
    }
}



//2. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character

const User = mongoose.model('user', userSchema);

app.post("/updateprofile", async (req, res) => {
    try {
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, 'mynameismaheshnodejsdevloper');

        console.log('auth_id', decoded)
        console.log('auth',onlyToken);
        const { first_name, last_name, email, password } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 8);
        let user = await User.findOneAndUpdate({ id: decoded._id },
            {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: encryptedPassword
            }, { new: true });
        console.log(user.last_name);
        res.status(200).json({data:user,msg:"User profile updated successfully"});
    } catch (err) {
        console.log("Invalid token");
        res.status(404).send('Invalid token');
    }
})


app.listen(6000, (err) => {
    console.log('listening port 6000')
})

// jwt.verify(onlyToken, 'mynameismaheshnodejsdevloper', function(err, decoded) {
//     console.log('id_decoded',decoded) // bar
// });       