'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Bots', [
    {
      Bot_Name: "EvilEye",
      Bot_Blurb: "While this bot's ultimate goal is world domination, he still has time to keep a very watchful eye on his lockees",
      Bot_Difficulty: "7/10",
      Max_Time_Before_Updates: 180,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      Bot_Name: "Herman",
      Bot_Blurb: "The most EVIL KH of them all. Don't expect them to leave your lock alone",
      Bot_Difficulty: "10/10",
      Max_Time_Before_Updates: 120,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('People', null, {});

  }
};
