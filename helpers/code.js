const { UserSetting } = require("../models");

async function NewCode(UserID) {
    const UserSettingsSearch = await UserSetting.findOne({
        where: {
            User_ID: UserID
        }
    });

    const DuplicateCharacters = UserSettingsSearch.Allow_Duplicate_Characters;
    const ComboType = UserSettingsSearch.Combo_Type;
    const ComboLength = UserSettingsSearch.Combo_Length;

    if (ComboType === "123" && DuplicateCharacters === true) {
       return NonDuplicateNumbers(ComboLength); 
    }
}

function NonDuplicateNumbers(Length) {
    let code = '';
    for(let i = 0; i < Length; i++) {
        code = Math.floor(Math.random() * 10) + code;
    }
    return code;
} 



module.exports = {
    NewCode
}