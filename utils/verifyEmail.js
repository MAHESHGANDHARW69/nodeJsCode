let nodemailer = require("nodemailer");
require('dotenv').config();

function createEmailSender (name,email,confirmationCode){
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL_ID,
            pass:process.env.PASSWORD
        }
    });
    
    var mailOptions = {
        from:process.env.EMAIL_ID,
        to:email,
        subject:"please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:${process.env.PORT}/confirm/${confirmationCode}> Click here</a>
        </div>`,       
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        console.log('You have been Registered Successfully' + info.response,email,subject,success);
    })
}

module.exports = {createEmailSender}