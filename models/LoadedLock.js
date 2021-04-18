const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const LoadedLock = sequelize.define("LoadedLock", {

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
            type: Sequelize.STRING,
            allowNull: false
        },
        Original_Lock_Deck: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Emergency_Keys_Enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Emergency_Keys_Amount: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Test_Lock: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Current_Freeze_ID: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        Unlocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Lockee_Rating: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Keyholder_Rating: {
            type: Sequelize.INTEGER,
            allowNull: true
        }          
    }, {sequelize});
    
    LoadedLock.associate = (models) => {
        LoadedLock.belongsTo(models.User, {foreignKey: "Keyholder"});
        LoadedLock.belongsTo(models.User, {foreignKey: "Lockee"});
        LoadedLock.belongsTo(models.LoadedOriginalLock, {foreignKey: "Original_Lock_Deck"})
        LoadedLock.belongsTo(models.Freeze, {foreignKey: "Current_Freeze_ID"})
      }; 
    
    return LoadedLock;
}