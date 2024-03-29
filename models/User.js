const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const User = sequelize.define("User", {
      
      User_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      UUID: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Keyholder: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      Lockee: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      Email_Validated: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      Validation_Code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Emergency_Keys: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    }, {sequelize}
    );

    User.associate = (models) => {
      User.hasMany(models.CreatedLock, {foreignKey: "User_ID"});
      User.hasMany(models.Session, {foreignKey: "User_ID"});
      User.hasMany(models.PasswordReset, {foreignKey: "User_ID"});
    };

    return User;
  }