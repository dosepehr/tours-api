const nodemailer = require('nodemailer');
const process = require('process');

const sendEmail = async ({ to, subject, text }) => {
    // 1) create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // 2) Define the email options
    const mailOptions = {
        from: 'Sepehr Do <dosepehr02@gmail.com>',
        to,
        subject,
        text,
        // html:
    };
    // 3) send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
