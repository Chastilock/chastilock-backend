const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    class LoadedLock extends Sequelize.Model {}
    LoadedLock.init({
        LoadedLock_ID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CreatedLock_ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Lockee: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Keyholder: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Code: {
            type: Sequelize.INTEGER,
            allowNull: false
        }        
    }, {sequelize});
    
    LoadedLock.associate = (models) => {
        LoadedLock.belongsTo(models.User, {foreignKey: "Keyholder"});
        LoadedLock.belongsTo(models.User, {foreignKey: "Lockee"});
      }; 
    
    return LoadedLock;
}