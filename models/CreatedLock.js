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
      Shared: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
      },
      Shared_Code: {
        type: Sequelize.TEXT,
        allowNull: false, 
      },
      OriginalLockType_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      TimerLockType_ID: {
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
      },
      Allow_Fakes: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Min_Fakes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Max_Fakes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Checkins_Enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Checkins_Frequency: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      Checkins_Window: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      Allow_Buyout: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Start_Lock_Frozen: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Disable_Keyholder_Decision: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Limit_Users: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      User_Limit_Amount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Block_Test_Locks: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Block_User_Rating_Enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Block_User_Rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Block_Already_Locked: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Block_Stats_Hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Only_Accept_Trusted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Require_DM: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Imported_From_CK: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      CK_ShareID: {
        type: Sequelize.STRING,
        allowNull: true
      }
    }, {sequelize}
    );

    CreatedLock.associate = (models) => {
      CreatedLock.belongsTo(models.User, {foreignKey: "User_ID"});
      CreatedLock.hasMany(models.LoadedLock, {foreignKey: "CreatedLock_ID"})
      CreatedLock.hasOne(models.OriginalLockType, {foreignKey: "Original_Deck_ID"})
      CreatedLock.hasOne(models.TimerLockType, {foreignKey: "Timer_Type_ID"})

    };

    return CreatedLock;
  }