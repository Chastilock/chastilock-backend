'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bots', {
      Bot_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Bot_Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Bot_Blurb: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Bot_Difficulty: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Max_Time_Before_Updates: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Bots");
  }
};
