const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const ChastikeyImport = sequelize.define("ChastikeyImport", {
      
      Transfer_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Chastikey_Username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Data: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      },
      Expires: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Started: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Complete: {
        type: Sequelize.DATE,
        allowNull: true
      },
      NumOfKeyholderLocks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      NumOfLockeeLocks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      AverageLockeeRating: {
        type: Sequelize.STRING,
        allowNull: false
      },
      AverageKeyholderRating: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Keyholders_Moved_Over: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    }, {sequelize}
    );

    ChastikeyImport.associate = (models) => {
      ChastikeyImport.belongsTo(models.User, {foreignKey: "User_ID"});
    }

    return ChastikeyImport;
}