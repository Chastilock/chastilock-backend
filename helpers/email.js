const nodemailer = require("nodemailer");
const { User } = require("../models");
const pug = require("pug")


const fromAddress = '"Havok The Bear" <havokthebear@example.com>'

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
        
        Thanks for joining Chastilock! Please use the following link to activate your account: https://api.chastilock.org/activate/${User.Validation_Code}
        
        We hope you have fun!
        Chastilock Team!`, // plain text body
        html: pug.renderFile(), // html body
    });
}
module.exports = sendEmail;