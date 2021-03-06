const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class OriginalLockType extends Sequelize.Model {}
    OriginalLockType.init({
      
      Original_Deck_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Variable_Max_Greens: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_Reds: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_Freezes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_Doubles: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_Stickies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_AddRed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_RemoveRed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Max_RandomRed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_Greens: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_Reds: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_Freezes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_Doubles: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_Stickies: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_AddRed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_RemoveRed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Variable_Min_RandomRed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    }, {sequelize}
    );

    OriginalLockType.associate = (models) => {
      OriginalLockType.belongsTo(models.CreatedLock, {foreignKey: "Original_Deck_ID"});
    }; 

    return OriginalLockType;
  }