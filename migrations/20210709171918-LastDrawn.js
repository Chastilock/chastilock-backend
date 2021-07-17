'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LoadedOriginalLocks', 'Last_Drawn', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'Chances_Last_Calulated'
    });
    await queryInterface.renameColumn("LoadedOriginalLocks", "Chances_Last_Calulated", "Chances_Last_Awarded");
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('LoadedLocks','Last_Drawn')
    await queryInterface.renameColumn("LoadedOriginalLocks", "Chances_Last_Awarded", "Chances_Last_Calulated");
  }
};
