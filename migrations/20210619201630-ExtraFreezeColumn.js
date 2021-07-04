'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn("Freezes", "Lock_ID", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "Freeze_ID",
      references: {
        model: "LoadedLocks",
        key: "LoadedLock_ID"
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn("Freezes", "Lock_ID");
  }
};
