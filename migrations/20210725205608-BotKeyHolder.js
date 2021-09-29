'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LoadedLocks', 'Bot_KH', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'Keyholder',
      references: {
        model: 'Bots',
        key: 'Bot_ID'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LoadedLocks', 'Bot_KH');
  }
};
