const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const PasswordReset = sequelize.define("PasswordReset", {
      
      PasswordReset_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      
    },
    {sequelize}
    );

    PasswordReset.associate = (models) => {
      PasswordReset.belongsTo(models.User, {foreignKey: "User_ID"});
    };

    return PasswordReset;
  }