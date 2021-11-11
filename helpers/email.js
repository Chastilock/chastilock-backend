const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: process.env.SMTPHost,
    port: process.env.SMTPPort,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTPUser, // generated ethereal user
        pass: process.env.SMTPPass, // generated ethereal password
    },
});

async function sendEmail(User_ID, Template) {

    let info = await transporter.sendMail({
        from: '"Chastilock" <noreply@chastlock.org>', // sender address
        to: "", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
}
module.exports = sendEmail;