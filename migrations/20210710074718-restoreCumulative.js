'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LoadedOriginalLocks', 'Cumulative', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: 'Remaining_GoAgain'
    });
    await queryInterface.addColumn('LoadedOriginalLocks', 'Hide_Card_Info', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: 'Cumulative'
    });
    await queryInterface.addColumn('LoadedOriginalLocks', 'Chance_Period', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'Hide_Card_Info'
    });








  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LoadedOriginalLocks','Chance_Period');
    await queryInterface.removeColumn('LoadedOriginalLocks','Hide_Card_Info');
    await queryInterface.removeColumn('LoadedOriginalLocks','Cumulative');
  }
};
