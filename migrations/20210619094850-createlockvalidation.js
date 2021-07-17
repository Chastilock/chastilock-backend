'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("CreatedLocks", "Start_Lock_Frozen", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: "Allow_Buyout"
    });

    await queryInterface.addColumn("LoadedLocks", "Timed_Unlock_Time", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "Original_Lock_Deck"
    });
    await queryInterface.addColumn("LoadedLocks", "Hide_Info", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "Timed_Unlock_Time"
    });
    await queryInterface.addColumn("LoadedLocks", "Trusted", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: "Test_Lock"
    });
    await queryInterface.addColumn("LoadedLocks", "Cumulative", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "Trusted"
    });
    await queryInterface.addColumn("LoadedLocks", "Chance_Period", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "Cumulative"
    });
    await queryInterface.addColumn("LoadedLocks", "Chances", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "Chance_Period"
    });
    await queryInterface.addColumn("LoadedLocks", "Last_Pick_Time", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "Chances"
    });
    await queryInterface.addColumn("LoadedLocks", "Last_Chance_Time", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "Last_Pick_Time"
    });
    await queryInterface.addColumn("LoadedOriginalLocks", "Multiple_Greens_Required", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: "Found_Green"
    });
    await queryInterface.removeColumn("LoadedOriginalLocks", "Cumulative");
    await queryInterface.removeColumn("LoadedOriginalLocks", "Hide_Card_Info");
    await queryInterface.removeColumn("LoadedOriginalLocks", "Chance_Period");

    await queryInterface.addColumn("OriginalLockTypes", "Variable_Max_Resets", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "Variable_Max_Doubles"
    });
    await queryInterface.addColumn("OriginalLockTypes", "Variable_Min_Resets", {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: "Variable_Min_Doubles"
    });
    await queryInterface.removeColumn("OriginalLockTypes", "Start_Lock_Frozen");
  },

  down: async (queryInterface, Sequelize) => {
    // not supported
  await queryInterface.addColumn("OriginalLockTypes", "Start_Lock_Frozen", {
    type: Sequelize.BOOLEAN,
    allowNull: false
  });
  await queryInterface.removeColumn("OriginalLockTypes", "Variable_Min_Resets");
  await queryInterface.removeColumn("OriginalLockTypes", "Variable_Max_Resets");

  await queryInterface.addColumn("LoadedOriginalLocks", "Chance_Period", {
    type: Sequelize.INTEGER,
    allowNull: false,
  });
  await queryInterface.addColumn("LoadedOriginalLocks","Hide_Card_Info", {
    type: Sequelize.BOOLEAN,
    allowNull: false
  });
  await queryInterface.addColumn("LoadedOriginalLocks","Cumulative", {
      type: Sequelize.BOOLEAN,
      allowNull: false
  });
  await queryInterface.removeColumn("LoadedOriginalLocks", "Multiple_Greens_Required");
  await queryInterface.removeColumn("LoadedLocks", "Last_Chance_Time");
  await queryInterface.removeColumn("LoadedLocks", "Last_Pick_Time");
  await queryInterface.removeColumn("LoadedLocks", "Chances");
  await queryInterface.removeColumn("LoadedLocks", "Chance_Period");
  await queryInterface.removeColumn("LoadedLocks", "Cumulative");
  await queryInterface.removeColumn("LoadedLocks", "Trusted");
  await queryInterface.removeColumn("LoadedLocks", "Hide_Info");
  await queryInterface.removeColumn("LoadedLocks", "Timed_Unlock_Time");
  await queryInterface.removeColumn("CreatedLocks", "Start_Lock_Frozen");



}
};
