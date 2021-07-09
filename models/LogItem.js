const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const User = sequelize.define("LogItem", {
      
      LogItem_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Lock_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      Source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
      },
      Description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }, {sequelize}
    );

    LogItem.associate = (models) => {
      LogItem.belongsTo(models.LoadedLock, {foreignKey: "Lock_ID"});
    };

    return LogItem;
  }