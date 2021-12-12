const nodemailer = require("nodemailer");
const { User } = require("../models");
const pug = require("pug")


const fromAddress = process.env.FromAddress

let transporter = nodemailer.createTransport({
    host: process.env.SMTPHost,
    port: process.env.SMTPPort,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTPUser, // generated ethereal user
        pass: process.env.SMTPPass, // generated ethereal password
    },
});

async function sendEmail(UserID, Template) {

    const UserSearch = await User.findOne({
        where: {
            User_ID: UserID
        }
    });

    if(UserSearch && UserSearch.Email !== null) {
        
        switch(Template) {
            case "ActivateEmail":
                sendActivationEmail(UserSearch);
                break;
            default:
                console.error("No such email template exists")
        }         
    }
}

const sendActivationEmail = async (User) => {
    
    let info = await transporter.sendMail({
        from: fromAddress, // sender address
        to: User.Email, // list of receivers
        subject: "Activate your email!", // Subject line
        text: `Hey there ${User.Username}, 
        Thanks for joining Chastilock! Please click the following link to activate your account: https://api.chastilock.org/activate/${User.Validation_Code}.
        This will allow us to send you emails. Currently this is just used to reset your password should you forget it. As always your data is kept sucurely and is never shared with 3rd parties.
        p We hope you have fun!
        p Chastilock Team!`, // plain text body
        html: pug.renderFile('web/views/emails/activateemail.pug', {Username: User.Username, Validation_Code: User.Validation_Code}) // html body
    });
}
module.exports = sendEmail;