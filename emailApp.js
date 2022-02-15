var nodemailer = require("nodemailer");

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
    subject:'sending email using nodejs',
    text:'That was easy!'        
};

transporter.sendMail(mailOptions,function(error,info){
    if(error){
        console.log(error)
    }else{
        console.log('Email sent' + info.response);
    }
})