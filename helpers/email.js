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

async function sendEmail(UserID, Template, Data) {

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
            case "ForgottenPassword":
                sendForgotenPassword(UserSearch, Data);
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

const sendForgotenPassword = async (User, Data) => {
    
    if(User.Email_Validated) {

        let info = await transporter.sendMail({
            from: fromAddress, // sender address
            to: User.Email, // list of receivers
            subject: "Reset your password!", // Subject line
            text: `Hey there ${User.Username}, 
            Someone (hopefully you!) has requested to reset your chastikey password! Please click the following link to reset your password: https://api.chastilock.org/passwordreset/${Data.code}/${User.Email}
            
            If this wasn't you, please ignore this email. If this happens reguarly, please get in touch!
            Best wishes!
            
            Chastilock Team!`, // plain text body
            html: pug.renderFile('web/views/emails/passwordreset.pug', {Username: User.Username, code: Data.code, email: User.Email}) // html body
        });
        console.log(info)
    }
}
module.exports = sendEmail;