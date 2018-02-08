const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    //service: "Gmail",
    auth: {
        user: "ferrarif1fanclub@gmail.com",
        pass: "ravisumitdevesh"
    }
});
module.exports = transporter;