'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LoadedOriginalLocks', 'Last_Drawn', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'Chances_Last_Calulated'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LoadedLocks','Last_Drawn')
  }
};
