const { htmlToText, convert } = require('html-to-text');
const nodemailer = require('nodemailer');
const process = require('process');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.name;
        this.url = url;
        this.from = `Sepehr Do <${process.env.EMAIL_USERNAME}>`;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'prod') {
            // using email services
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    async send(template, subject) {
        //! use template to load a specific html file
        // 1) Render HTML based on a pug template
        const html = `<div>hiii</div>`;
        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html, {}),
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)',
        );
    }
};
