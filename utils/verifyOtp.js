require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendOtpVerfiy = (phone) => {
    client.verify.services(process.env.VERIFY_SERVICE_SID)
        .verifications
        .create({ to: `+91${phone}`, channel: 'sms' })
        .then(verification => console.log(verification.status))
        .catch(e => {
            console.log(e)
        });
}