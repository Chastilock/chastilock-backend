const { PasswordReset } = require('../../models');
const Bcypt = require('bcryptjs');

async function passwordReset(req, res) {
    
    const PasswordResetSearch = await PasswordReset.findOne({
        where: {
            Code: req.params.code || req.body.code
        }
    });

    if(PasswordResetSearch) {
        
        const Expiry = new Date(PasswordResetSearch.Expires);
        const Now = new Date();

        if(Now.getTime() > Expiry.getTime()) {
            res.send("Request has expired! Please request a new link")
        }

        const User = await PasswordResetSearch.getUser();

        if(User.Email === req.params.email || User.Email === req.body.email) {

            if(req.body.code) {

                if(User.Email === req.body.email) {
                    let error = false;
                    //Atempt to reset the password!!
                    if(req.body.newpassword != req.body.newpasswordconfirm) {
                        res.send("The passwords you have entered don't match");
                        error = true;
                    }
        
                    if(req.body.newpassword.length < 8) {
                        res.send("Your password needs to be at least 8 characters");
                        error = true;
                    }

                    if(error === false) {
                        const hashedPassword = Bcypt.hashSync(req.body.newpassword, 10);
                        User.set({
                            Password: hashedPassword
                        });
                        await User.save();
                        PasswordResetSearch.destroy();
                        res.send("Password changed successfully!");
                    }
                } else {
                    res.send("oh nose! Something has gone wrong!")
                }

            } else {
                res.render("passwordreset.pug", {Code: req.params.code, Email: req.params.email})
            }
        } else {
            res.send("You have clicked an invalid link, please try again!")
        }

    } else {
        res.send("You have clicked an invalid link, please try again!")
    }
}
module.exports = passwordReset;