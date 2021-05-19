const { User } = require('../models');

async function GetUsername(UserID) {
    const UserSearch = await User.findOne({
        where: {
            User_ID: UserID
        }
    })

    if(UserSearch) {
        return UserSearch.Username
    } else {
        return "Deleted User"
    }
}

module.exports = {
    GetUsername
}
