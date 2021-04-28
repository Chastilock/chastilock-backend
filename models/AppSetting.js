const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const AppSetting = sequelize.define("AppSetting", {
      
      AppSetting_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Setting_Name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      Setting_Value: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      }

    }, {sequelize}
    );

    return AppSetting;
  }