'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "Joined_CK_Timestamp");
    await queryInterface.removeColumn("Users", "CK_Username");
    await queryInterface.removeColumn("Users", "CK_UserID");
    await queryInterface.removeColumn("Users", "CK_Lockee_Rating");
    await queryInterface.removeColumn("Users", "CK_Lockee_TotalRatings");
    await queryInterface.removeColumn("Users", "CK_KH_Rating");
    await queryInterface.removeColumn("Users", "CK_KH_TotalRatings");
    await queryInterface.removeColumn("OriginalLockTypes", "Imported_From_CK");
    await queryInterface.removeColumn("TimerLockTypes", "Imported_From_CK");
    await queryInterface.removeColumn("CreatedLocks", "Imported_From_CK");
    await queryInterface.removeColumn("CreatedLocks", "CK_ShareID");
    await queryInterface.removeColumn("LoadedLocks", "Imported_From_CK");
    await queryInterface.removeColumn("LoadedLocks", "CK_ShareID");
    await queryInterface.dropTable("ChastikeyImports");
    await queryInterface.dropTable("CKStats");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "Joined_CK_Timestamp", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "Emergency_Keys"
  });

  await queryInterface.addColumn("Users", "CK_Username", {
    type: Sequelize.STRING,
    allowNull: true,
    after: "Joined_CK_Timestamp"
  });
  
  await queryInterface.addColumn("Users", "CK_UserID", {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: "CK_Username"
  });

  await queryInterface.addColumn("CreatedLocks", "Imported_From_CK", {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    after: "Require_DM"
  });

  await queryInterface.addColumn("OriginalLockTypes", "Imported_From_CK", {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    after: "Max_Resets"
  });

  await queryInterface.addColumn("TimerLockTypes", "Imported_From_CK", {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    after: "Hide_Timer"
  });

  await queryInterface.addColumn("CreatedLocks", "CK_ShareID", {
    type: Sequelize.STRING,
    allowNull: true,
    after: "Imported_From_CK"
  });

  await queryInterface.addColumn("LoadedLocks", "Imported_From_CK", {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    after: "Real_Lock"
  });

  await queryInterface.addColumn("LoadedLocks", "CK_ShareID", {
    type: Sequelize.STRING,
    allowNull: true,
    after: "Imported_From_CK"
  });

  await queryInterface.addColumn("Users", "CK_Lockee_Rating", {
    type: Sequelize.FLOAT,
    allowNull: true,
    after: "CK_UserID"
  });

  await queryInterface.addColumn("Users", "CK_Lockee_TotalRatings", {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: "CK_Lockee_Rating"
  });

  await queryInterface.addColumn("Users", "CK_KH_Rating", {
    type: Sequelize.FLOAT,
    allowNull: true,
    after: "CK_Lockee_TotalRatings"
  });

  await queryInterface.addColumn("Users", "CK_KH_TotalRatings", {
    type: Sequelize.INTEGER,
    allowNull: true,
    after: "CK_KH_Rating"
  });

  await queryInterface.createTable("ChastikeyImports", {
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
  });
  await queryInterface.createTable("CKStats", {
    CKStats_ID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    User_ID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'User_ID'
      }
    },
    Keyholder_Level: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Keyholder_First_Time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    Keyholder_Locks_Managed: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Lockee_Average_Time_Locked: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "In seconds"
    }, 
    Lockee_Cumulative_Time_Locked: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "In seconds"
    },
    Lockee_Level: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    Lockee_Longest_Lock: {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "In seconds"
    },
    Lockee_Completed_Locks: {
      type: Sequelize.INTEGER,
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
  });
  }
};
