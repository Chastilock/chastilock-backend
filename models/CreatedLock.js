const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const CreatedLock = sequelize.define("CreatedLock", {
      
      Lock_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      OriginalLockType_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Lock_Name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Disabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    }, {sequelize}
    );

    CreatedLock.associate = (models) => {
      CreatedLock.belongsTo(models.User, {foreignKey: "User_ID"});
      CreatedLock.hasOne(models.OriginalLockType, {foreignKey: "Original_Deck_ID"})
    };

    return CreatedLock;
  }