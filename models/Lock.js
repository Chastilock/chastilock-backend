const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class Lock extends Sequelize.Model {}
    Lock.init({
      
      Lock_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.STRING,
        allowNull: false,
      }


    }, {sequelize}
    );

    Lock.associate = (models) => {
      Lock.hasOne(models.User, {foreignKey: "User_ID"});
    };

    return Lock;
  }