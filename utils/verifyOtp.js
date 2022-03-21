require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendOtpVerfiy = (phone) => {
    client.verify.services(process.env.VERIFY_SERVICE_SID)
        .verifications
        .create({ to: `+91${phone}`, channel: 'sms' })
        .then(verification => console.log(verification))
        .catch(e => {
            console.log(e)
        });
}

exports.sendSms = (phone, code) => {
    client.messages
        .create({
            body: code,
            from: process.env.TWILIO_TWILLO_NUMBER,
            to: `+91${phone}`
        })
        .then(message => console.log('================>', message.sid))
        .catch(e => {
            console.log(e)
        });
}