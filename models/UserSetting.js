const Sequelize = require("sequelize");

module.exports = (sequelize) => {

    const UserSetting = sequelize.define("UserSetting", {
        
        Setting_ID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        User_ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Combo_Type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Allow_Duplicate_Characters: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Combo_Length: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Show_Combo_To_Keyholder: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Share_Stats: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
                  
    }, {sequelize});
    
    UserSetting.associate = (models) => {
        UserSetting.belongsTo(models.User, {foreignKey: "User_ID"});
      }; 
    
    return UserSetting;
}