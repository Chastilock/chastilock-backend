'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("Users", "Joined_CK_Timestamp", {
        type: Sequelize.DATE,
        allowNull: true,
        after: "Emergency_Keys"
    });

    queryInterface.addColumn("Users", "CK_Username", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "Joined_CK_Timestamp"
    });
    
    queryInterface.addColumn("Users", "CK_UserID", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "CK_Username"
    });

    queryInterface.addColumn("CreatedLocks", "Imported_From_CK", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "Require_DM"
    });

    queryInterface.addColumn("OriginalLockTypes", "Imported_From_CK", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "Max_Resets"
    });

    queryInterface.createTable("ChastikeyImports", {
      Transfer_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "User_ID"
        }
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("Users", "Joined_CK_Timestamp");
    queryInterface.removeColumn("Users", "CK_Username");
    queryInterface.removeColumn("Users", "CK_UserID");
    queryInterface.removeColumn("OriginalLockTypes", "Imported_From_CK");
    queryInterface.removeColumn("CreatedLocks", "Imported_From_CK");
    queryInterface.dropTable("ChastikeyImports");
  }
};
