let nodemailer = require("nodemailer");

function createEmailSender (){
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
        text:'You have been Registered Successfully!Please Login!!!!!!'        
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        console.log('You have been Registered Successfully' + info.response);
    })
}

module.exports = {createEmailSender}