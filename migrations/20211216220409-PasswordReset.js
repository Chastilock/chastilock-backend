'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PasswordResets', {
      PasswordReset_ID: {
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
      Code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      Last_Emailed: {
        type: Sequelize.DATE,
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PasswordResets");
  }
}
