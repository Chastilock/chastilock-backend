var jwt = require('jsonwebtoken');
class AuthHelpers {
  generateJWT(UserUUID) {
    var token = jwt.sign({ UserUUID }, process.env.JWT_SECRET);
    return token;
  }
}
module.default = AuthHelpers;
