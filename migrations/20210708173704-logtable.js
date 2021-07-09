'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // LogItems
    await queryInterface.createTable('LogItems', {
      LogItem_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Lock_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "LoadedLocks",
          key: "LoadedLock_ID"
        }
      },
      Time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      Source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      Description: {
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LogItems');
  }
}