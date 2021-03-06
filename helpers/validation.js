function ValidateEmail(Email) {
  if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(Email)) {
    return true;
  } else {
    return false;
  }
}

async function CheckUsernameAvailable(Username) {
  const {User} = require('../models');
  const UserSearch = await User.findOne({
    where: {
      Username: Username
    }
  });
  if(UserSearch) {
    return false;
  } else {
    return true;
  }
}

async function CheckEmailAvailable(Email) {
  const {User} = require('../models');
  const UserSearch = await User.findOne({
    where: {
      Email: Email
    }
  });
  if(UserSearch) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  ValidateEmail,
  CheckUsernameAvailable,
  CheckEmailAvailable
};


