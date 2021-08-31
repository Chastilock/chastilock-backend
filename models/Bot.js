const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const Bot = sequelize.define("Bot", {
      
      Bot_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Bot_Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Bot_Blurb: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Bot_Difficulty: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Max_Time_Before_Updates: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
      
    },
    {
      indexes: [
        {
            unique: true,
            fields: ['Bot_Name']
        }
    ]
    },{sequelize}
    );

    return Bot;
  }