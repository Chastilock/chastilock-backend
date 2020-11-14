const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class User extends Sequelize.Model {}
    User.init({
      
      User_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      UUID: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      Password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Username: {
        type: Sequelize.STRING,
        allowNull: true
      }
    }, {sequelize}
    );

    User.associate = (models) => {
      User.hasMany(models.Lock, {foreignKey: "User_ID"});
    };

    return User;
  }