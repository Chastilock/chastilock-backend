'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AppSettings', [
      {
        Setting_Name: 'Allow_Signups',
        Setting_Value: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Setting_Name: 'Allow_LoadLock',
        Setting_Value: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Setting_Name: 'Allow_CreateLock',
        Setting_Value: "true",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Setting_Name: 'Killswitch',
        Setting_Value: "false",
        createdAt: new Date(),
        updatedAt: new Date()
      },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AppSettings', null, {});
  }
};
