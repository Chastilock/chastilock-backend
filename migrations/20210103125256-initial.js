'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // App
    await queryInterface.createTable('Apps', {
      App_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      API_Key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      API_Secret: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // User
    await queryInterface.createTable('Users', {
      User_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      UUID: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Username: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Keyholder: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      Lockee: {
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

    await queryInterface.createTable('UserSettings', {
      Setting_ID: {
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
      Combo_Type: {
          type: Sequelize.STRING,
          allowNull: false
      },
      Allow_Duplicate_Characters: {
          type: Sequelize.BOOLEAN,
          allowNull: false
      },
      Combo_Length: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Show_Combo_To_Keyholder: {
          type: Sequelize.BOOLEAN,
          allowNull: false
      },
      Share_Stats: {
          type: Sequelize.BOOLEAN,
          allowNull: false
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

    // Session
    await queryInterface.createTable('Sessions', {
      Session_ID: {
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
      Token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      App_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Apps',
          key: 'App_ID'
        }
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
    
    // OriginalLockType
    await queryInterface.createTable('OriginalLockTypes', {
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
      Start_Lock_Frozen: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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

    await queryInterface.createTable('TimerLockTypes', {
      Timer_Type_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Max_Days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Max_Hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Max_Minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Min_Days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Min_Hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Min_Minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Hide_Timer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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

    await queryInterface.createTable('CreatedLocks', {
      Lock_ID: {
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
        references: {
          model: 'OriginalLockTypes',
          key: 'Original_Deck_ID'
        }
      },
      TimerLockType_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'TimerLockTypes',
          key: 'Timer_Type_ID'
        }
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    //LoadedOriginalLock
    await queryInterface.createTable('LoadedOriginalLocks', {
      Original_Loaded_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Remaining_Red: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Green: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Found_Green: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Sticky: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Add1: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Add2: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Add3: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Remove1: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Remove2: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Freeze: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Double: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_Reset: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Remaining_GoAgain: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    Cumulative: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    Hide_Card_Info: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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

    //Freeze
    await queryInterface.createTable('Freezes', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    //LoadLock
    await queryInterface.createTable('LoadedLocks', {
      LoadedLock_ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CreatedLock_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CreatedLocks',
          key: 'Lock_ID'
        }
      },
      Lockee: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'User_ID'
          }
      },
      Keyholder: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'User_ID'
        }
      },
      Code: {
          type: Sequelize.STRING,
          allowNull: false
      },
      Original_Lock_Deck: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'LoadedOriginalLocks',
          key: 'Original_Loaded_ID'
        }
      },
      Emergency_Keys_Enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Emergency_Keys_Amount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Test_Lock: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Current_Freeze_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Freezes",
          key: "Freeze_ID"
        }
      },  
      Unlocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Lockee_Rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Keyholder_Rating: {
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

    await queryInterface.createTable('AppSettings', {
      
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
        allowNull: false
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sessions');
    await queryInterface.dropTable('Apps');
    await queryInterface.dropTable('LoadedLocks');
    await queryInterface.dropTable('CreatedLocks');
    await queryInterface.dropTable('OriginalLockTypes');
    await queryInterface.dropTable('LoadedOriginalLocks');
    await queryInterface.dropTable('UserSettings');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Freezes');
    await queryInterface.dropTable('TimerLockTypes');
    await queryInterface.dropTable('AppSettings');
  }
}