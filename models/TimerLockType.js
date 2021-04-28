const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const TimerLockType = sequelize.define("TimerLockType", {
      
      Timer_Type_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Max_Days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Max_Hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Max_Minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Min_Days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Min_Hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Min_Minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Hide_Timer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    }, {sequelize}
    );

    return TimerLockType;
  }