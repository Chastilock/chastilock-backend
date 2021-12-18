const { PasswordReset } = require('../../models');

async function passwordReset(req, res) {
    
    const PasswordResetSearch = await PasswordReset.findOne({
        where: {
            Code: req.params.code
        }
    });

    if(PasswordResetSearch) {
        
        const Expiry = new Date(PasswordResetSearch.Expires);
        const Now = new Date();

        if(Now.getTime() > Expiry.getTime()) {
            res.send("Request has expired! Please request a new link")
        }

        const User = await PasswordResetSearch.getUser();

        if(User.Email === req.params.email) {
            res.render("passwordreset.pug", {Code: req.params.code, Email: req.params.email})
        } else {
            res.send("You have clicked an invalid link, please try again!")
        }

    } else {
        res.send("You have clicked an invalid link, please try again!")
    }
}
module.exports = passwordReset;