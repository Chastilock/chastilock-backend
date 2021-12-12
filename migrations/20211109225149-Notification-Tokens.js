'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Sessions", "Notification_Token", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "App_ID"
  });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Sessions", "Notification_Token");
  }
};
