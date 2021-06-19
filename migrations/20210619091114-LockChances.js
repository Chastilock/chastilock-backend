'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("LoadedOriginalLocks", "Chance_Period", {
        type: Sequelize.INTEGER,
        allowNull: false
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Chances_Remaining", {
        type: Sequelize.INTEGER,
        allowNull: false
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Chances_Last_Calulated", {
        type: Sequelize.DATE,
        allowNull: false
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Auto_Resets_Paused", {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Auto_Resets_Frequency", {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Last_Auto_Reset", {
        type: Sequelize.DATE,
        allowNull: true
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.removeColumn("LoadedOriginalLocks", "Chance_Period"),
      await queryInterface.removeColumn("LoadedOriginalLocks", "Chances_Remaining"),
      await queryInterface.removeColumn("LoadedOriginalLocks", "Chances_Last_Calulated"),
      await queryInterface.removeColumn("LoadedOriginalLocks", "Auto_Resets_Paused"),
      await queryInterface.removeColumn("LoadedOriginalLocks", "Auto_Resets_Frequency"),
      await queryInterface.removeColumn("LoadedOriginalLocks", "Last_Auto_Reset")
    ]
  }
};
