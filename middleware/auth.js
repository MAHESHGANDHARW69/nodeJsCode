const jwt = require("jsonwebtoken");
require('dotenv').config();

function tokenVerify (req,res,next){    
    try{
        const token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
        var userId = decoded.id
        return userId
    }catch(err){
        res.status(404).send("Unauthorized access.")
    }
}

module.exports = {tokenVerify}