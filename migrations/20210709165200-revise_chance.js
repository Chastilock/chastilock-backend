'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LoadedLocks', "Cumulative");
    await queryInterface.removeColumn('LoadedLocks', "Chance_Period");
    await queryInterface.removeColumn('LoadedLocks', "Chances");
    await queryInterface.removeColumn('LoadedLocks', "Last_Pick_Time");
    await queryInterface.removeColumn('LoadedLocks', "Last_Chance_Time");

  },
  down: async (queryInterface, Sequelize) => {
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
  }
};
