const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const LoadedOriginalLock = sequelize.define("LoadedOriginalLock", {

        Original_Loaded_ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        Remaining_Red: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Green: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Found_Green: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Sticky: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Add1: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Add2: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Add3: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Remove1: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Remove2: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Freeze: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Double: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_Reset: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Remaining_GoAgain: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Cumulative: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        Hide_Card_Info: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Chance_Period: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

                
    }, {sequelize});
    
    return LoadedOriginalLock;
}