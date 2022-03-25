let nodemailer = require("nodemailer");
require('dotenv').config();

function emailVerfiyToken(email, confirmationCode) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Please Confirm Your Account",
        html: `<h1>Email Confirmation</h1>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:${process.env.PORT}/confirm/${confirmationCode}> Click here</a>
        </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        console.log('You have been Registered Successfully' + info.response, email, subject, success);
    })
}

function emailVerfiyOtp(email, otp) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: "Please Confirm Your Account",
        html: `<h1>Email Confirmation</h1>
        <h2>OTP:- ${otp}</h2>
        <p>Thank you for subscribing. Please confirm your number by the following otp</p>
        </div>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        console.log('You have been Registered Successfully' + info.response, email, subject, success);
    })
}

function approvedUserEmail (email){
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'mahesh.thoughtwin@gmail.com',
            pass:'mahesh12345'
        }
    });
    
    var mailOptions = {
        from:'mahesh.thoughtwin@gmail.com',
        to:email,
        subject:'Nodemailer Email Test Module',
        text:'You have been Approved Successfully!please login now!'        
    };
    transporter.sendMail(mailOptions,(error,info)=>{
        console.log('You have been Registered Successfully' + info.response);
        res.send('You have been Approved Successfully')
    })
}

module.exports = { emailVerfiyOtp, emailVerfiyToken,approvedUserEmail }