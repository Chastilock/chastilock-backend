const { User } = require('../../models');

async function activateemail(req, res) {
    const ActivationCode = req.params.code;
    const UserSearch = await User.findOne({
        where: {
            "Validation_Code": ActivationCode
        }
    });

    if(!UserSearch) {
        return res.end("Invalid link!")
    }

    if(UserSearch.Email_Validated === true) {
        return res.end("Account already activated!")
    }

    const DataToSet = {
        Email_Validated: true
    }

    UserSearch.set(DataToSet);
    UserSearch.save();
    return res.end("Account Activated!! You can now login")
    
}
module.exports = activateemail