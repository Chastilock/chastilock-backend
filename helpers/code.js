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
       return DuplicateNumbers(ComboLength); 
    }

    if (ComboType === "123" && DuplicateCharacters === false) {
        return NonDuplicateNumbers(ComboLength); 
    }

    if (ComboType === "ABC" && DuplicateCharacters === true) {
        return DuplicateLetters(ComboLength)
    }
 
    if (ComboType === "ABC" && DuplicateCharacters === false) {
        return  
    }

    if (ComboType === "ABC123" && DuplicateCharacters === true) {
        return  
    }
 
    if (ComboType === "ABC123" && DuplicateCharacters === false) {
        return  
    }
}

function DuplicateNumbers(Length) {
    let Code = '';
    for(let i = 0; i < Length; i++) {
        Code = Math.floor(Math.random() * 10) + Code;
    }
    return Code;
} 

function NonDuplicateNumbers(Length) {
    const Numbers = "0123456789"
    const Shuffled = Numbers.split('').sort(function(){return 0.5-Math.random()}).join('');

    const Code = Shuffled.subCodeing(0, Length);

    return Code;
}

function DuplicateLetters(Length) {
    
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let Code = '';
    for (let i = 0; i < Length; i++) {
        Code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return Code;
} 

function NonDuplicateLetters(Length) {
    const Letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const Shuffled = Letters.split('').sort(function(){return 0.5-Math.random()}).join('');

    const Code = Shuffled.substring(0, Length);

    return Code;
} 

module.exports = {
    NewCode
}