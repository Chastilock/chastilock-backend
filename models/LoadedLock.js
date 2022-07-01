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
            allowNull: true
        },
        Lockee: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Keyholder: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Bot_KH: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        Code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Original_Lock_Deck: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Timed_Unlock_Time: {
            type: Sequelize.DATE,
            allowNull: true,      
        },    
        Hide_Info: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        Trusted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Last_KH_Change: {
            type: Sequelize.DATE,
            allowNull: true
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
        },
        Free_Unlock: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },
        Real_Lock: { 
            allowNull: true,
            type: Sequelize.INTEGER
        }       
    }, {sequelize});
    
    LoadedLock.associate = (models) => {
        LoadedLock.belongsTo(models.CreatedLock, {foreignKey: "CreatedLock_ID"})
        LoadedLock.belongsTo(models.User, {as: "KeyholderUser", foreignKey: "Keyholder"});
        LoadedLock.belongsTo(models.Bot, {foreignKey: "Bot_KH"});
        LoadedLock.belongsTo(models.User, {as: "LockeeUser", foreignKey: "Lockee"});
        LoadedLock.belongsTo(models.LoadedOriginalLock, {foreignKey: "Original_Lock_Deck"})
        LoadedLock.belongsTo(models.Freeze, {foreignKey: "Current_Freeze_ID"})
        LoadedLock.belongsTo(models.LoadedLock, {foreignKey: "Real_Lock"})  
    }; 
    
    return LoadedLock;
}