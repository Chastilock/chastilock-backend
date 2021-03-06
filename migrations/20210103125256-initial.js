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
      Created: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Keyholder: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Lockee: {
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

    // CreatedLock
    
    // OriginalLockType
    await queryInterface.createTable('OriginalLockTypes', {
      Original_Deck_ID: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
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
      OriginalLockType_ID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'OriginalLockType',
          key: 'Original_Deck_ID'
        }
      },
      Lock_Name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Disabled: {
        type: Sequelize.INTEGER,
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

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Apps');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Sessions');
    await queryInterface.dropTable('CreatedLocks');
    await queryInterface.dropTable('OriginalLockType');
  }
};