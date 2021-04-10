const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const Freeze = sequelize.define("Freeze", {
      
      Freeze_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Lock_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Started: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      EndTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      
    }, {sequelize}
    );
    Freeze.associate = (models) => {
      Freeze.belongsTo(models.LoadedLock, {foreignKey: "Lock_ID"})
    }
      return Freeze;
  }