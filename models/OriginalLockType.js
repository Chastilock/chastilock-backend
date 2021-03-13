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
      },
      Chance_Period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Cumulative: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Multiple_Greens_Required: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Hide_Card_Info: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Allow_Fakes: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Checkins_Frequency: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Checkins_Window: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Allow_Buyout: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Allow_Buyout: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Start_Lock_Frozen: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Disable_Keyholder_Decision: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Disable_Keyholder_Decision: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Limit_Users: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      User_Limit_Amount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Block_Test_Locks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Block_User_Rating_Enabled: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Block_User_Rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Block_Already_Locked: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Block_Stats_Hidden: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Only_Accept_Trusted: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Require_DM: {
        type: Sequelize.INTEGER,
        allowNull: false
      }      
    }, {sequelize}
    );

    OriginalLockType.associate = (models) => {
      OriginalLockType.belongsTo(models.CreatedLock, {foreignKey: "Original_Deck_ID"});
    }; 

    return OriginalLockType;
  }