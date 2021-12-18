const { PasswordReset } = require('../../models');
const Bcypt = require('bcryptjs');

async function actionPasswordReset(req, res) {
    const PasswordResetSearch = await PasswordReset.findOne({
        where: {
            Code: req.body.code
        }
    });

    if(PasswordResetSearch) {
        
        const Expiry = new Date(PasswordResetSearch.Expires);
        const Now = new Date();

        if(Now.getTime() > Expiry.getTime()) {
            res.send("Request has expired! Please request a new link")
        }

        const User = await PasswordResetSearch.getUser();

        if(User.Email === req.body.email) {
            //Atempt to reset the password!!
            if(req.body.newpassword != req.body.newpasswordconfirm) {
                res.send("The passwords you have entered don't match")
            }

            if(req.body.newpassword.length < 8) {
                res.send("Your password needs to be at least 8 characters")
            }

            const hashedPassword = Bcypt.hashSync(req.body.newpassword, 10);
            User.set({
                Password: hashedPassword
            });
            await User.save();
            PasswordResetSearch.destroy();
            res.send("Password changed successfully!")


        } else {
            res.send("You have clicked an invalid link, please try again!")
        }
    } else {
        res.send("You have clicked an invalid link, please try again!")
    }
}
module.exports = actionPasswordReset;