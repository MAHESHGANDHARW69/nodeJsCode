let nodemailer = require("nodemailer");

// async ()=>{
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
        text:'You have been Registered Successfully!please login now!'        
    };
// }

module.exports = {
    transporter,mailOptions
}