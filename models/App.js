const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class App extends Sequelize.Model {}
    App.init({
      
      App_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      API_Key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      API_Secret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
    }, {sequelize}
    );

    /* CreatedLock.associate = (models) => {
      CreatedLock.belongsTo(models.User, {foreignKey: "User_ID"});
    }; */

    return App;
  }