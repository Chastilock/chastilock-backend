const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const OriginalLockType = sequelize.define("OriginalLockType", {
      
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
      },
      Chance_Period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Cumulative: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Multiple_Greens_Required: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Hide_Card_Info: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
      Auto_Resets_Enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Reset_Frequency: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Max_Resets: {
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
        allowNull: true
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
      }      
    }, {sequelize}
    );

    OriginalLockType.associate = (models) => {
      OriginalLockType.belongsTo(models.CreatedLock, {foreignKey: "Original_Deck_ID"});
    }; 

    return OriginalLockType;
  }