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
        return DuplicateLetters(ComboLength);
    }
 
    if (ComboType === "ABC" && DuplicateCharacters === false) {
        return NonDuplicateLetters(ComboLength);
    }

    if (ComboType === "ABC123" && DuplicateCharacters === true) {
        return DuplicateLettersAndNumbers(ComboLength);
    }
 
    if (ComboType === "ABC123" && DuplicateCharacters === false) {
        return NonDuplicateLettersAndNumbers(ComboLength);  
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
    
    let Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let Code = '';
    for (let i = 0; i < Length; i++) {
        Code += Letters.charAt(Math.floor(Math.random() * Letters.length));
    }

    return Code;
} 

function NonDuplicateLetters(Length) {
    const Letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const Shuffled = Letters.split('').sort(function(){return 0.5-Math.random()}).join('');

    const Code = Shuffled.substring(0, Length);

    return Code;
}

function DuplicateLettersAndNumbers(Length) {
    
  let Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let Code = '';
  for (let i = 0; i < Length; i++) {
      Code += Chars.charAt(Math.floor(Math.random() * Chars.length));
  }
  return Code;
}

function NonDuplicateLettersAndNumbers(Length) {
  const Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const Shuffled = Chars.split('').sort(function(){return 0.5-Math.random()}).join('');
  const Code = Shuffled.substring(0, Length);

  return Code;
}



module.exports = {
    NewCode
}