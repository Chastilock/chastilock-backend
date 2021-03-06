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
        allowNull: false,
      },
      
    }, {sequelize}
    );

    App.associate = (models) => {
      App.hasMany(models.Session, {foreignKey: "App_ID"});
    };

    return App;
  }