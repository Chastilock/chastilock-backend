const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class CreatedLock extends Sequelize.Model {}
    CreatedLock.init({
      
      Lock_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Lock_Type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Lock_Type_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Lock_Name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Disabled: {
        type: Sequelize.INTEGER,
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