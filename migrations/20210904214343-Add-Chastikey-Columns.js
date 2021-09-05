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
        allowNull: false 
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
    queryInterface.dropTable("ChastikeyImports");
  }
};
