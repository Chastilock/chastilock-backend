const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class Lock extends Sequelize.Model {}
    Lock.init({
      
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
      Lock_Name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Disabled: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Fixed_Length: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_Greens: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_Reds: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_Freezes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_Doubles: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_Stickies: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_AddRed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_RemoveRed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Max_RandomRed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_Greens: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_Reds: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_Freezes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_Doubles: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_Stickies: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_AddRed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_RemoveRed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Variable_Min_RandomRed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    }, {sequelize}
    );

    Lock.associate = (models) => {
      Lock.hasOne(models.User, {foreignKey: "User_ID"});
    };

    return Lock;
  }