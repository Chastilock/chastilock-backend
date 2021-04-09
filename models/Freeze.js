const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const Freeze = sequelize.define("Freeze", {
      
      Freeze_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Started: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      EndTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      
    }, {sequelize}
    );

    return Freeze;
  }