'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('LoadedLocks', 'Last_KH_Change', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'Trusted'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('LoadedLocks','Last_KH_Change')
  }
};
