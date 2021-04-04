'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Apps', [{
        App_ID: 1,
        Name: 'Android App',
        API_Key: 'test',
        API_Secret: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
      await queryInterface.bulkInsert('Users', [{
        User_ID: 1,
        UUID: '42e28bdd-626d-4a1c-8aa1-a63064041c1e',
        Email: "thisisatest@example.com",
        Username: "Havok",
        Password: "$2a$10$mR//cp5SsXUOGFTn9oC.a.0H.sUOBG3Y0IVM3RAHEToNpfLYHue2a",
        Keyholder: 1,
        Lockee: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
      await queryInterface.bulkInsert('Users', [{
        User_ID: 2,
        UUID: 'fa48915c-4a9a-4eff-82d4-763e3b9608fe',
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
      await queryInterface.bulkInsert('Sessions', [{
        User_ID: 1,
        Token: "testtoken",
        App_ID: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Apps', null, {});
     await queryInterface.bulkDelete('Users', null, {});
     await queryInterface.bulkDelete('Sessions', null, {});
    
  }
};
