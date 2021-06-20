const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const Session = sequelize.define("Session", {
      
      Session_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      App_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
      
    }, {sequelize}
    );

    Session.associate = (models) => {
      Session.belongsTo(models.App, {foreignKey: "App_ID"});
      Session.belongsTo(models.User, {foreignKey: "User_ID"});
    };

    return Session;
  }