let nodemailer = require("nodemailer");

function createEmailSender (email,subject,success){
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
        subject:subject,
        text:success        
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        console.log('You have been Registered Successfully' + info.response,email,subject,success);
    })
}

module.exports = {createEmailSender}