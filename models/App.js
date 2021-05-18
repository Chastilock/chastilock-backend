const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const App = sequelize.define("App", {
      
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
      
    },
    {
      indexes: [
        {
            unique: true,
            fields: ['API_Key']
        },
        {
          unique: true,
          fields: ['API_Secret']
        },
        {
          unique: true,
          fields: ['Name']
        },

    ]
    },{sequelize}
    );

    App.associate = (models) => {
      App.hasMany(models.Session, {foreignKey: "App_ID"});
    };

    return App;
  }