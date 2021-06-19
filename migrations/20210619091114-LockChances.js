'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn("LoadedOriginalLocks", "Chance_Period", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "Hide_Card_Info"
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Chances_Remaining", {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "Chance_Period"
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Chances_Last_Calulated", {
        type: Sequelize.DATE,
        allowNull: false,
        after: "Chances_Remaining"
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Auto_Resets_Paused", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after: "Chances_Last_Calulated"
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Auto_Resets_Frequency", {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "Auto_Resets_Paused"
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Auto_Resets_Time_Left", {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "Auto_Resets_Frequency"
      }),
      await queryInterface.addColumn("LoadedOriginalLocks", "Last_Auto_Reset", {
        type: Sequelize.DATE,
        allowNull: true,
        after: "Auto_Resets_Time_Left"
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
      await queryInterface.removeColumn("LoadedOriginalLocks", "Auto_Resets_Time_Left"),
      await queryInterface.removeColumn("LoadedOriginalLocks", "Last_Auto_Reset")
    ]
  }
};
