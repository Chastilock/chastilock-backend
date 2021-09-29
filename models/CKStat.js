const Sequelize = require('sequelize');

module.exports = (sequelize) => {

    const CKStat = sequelize.define("CKStat", {
      
      CKStats_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      User_ID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Keyholder_Level: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Keyholder_First_Time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      Keyholder_Locks_Managed: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Lockee_Average_Time_Locked: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "In seconds"
      }, 
      Lockee_Cumulative_Time_Locked: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "In seconds"
      },
      Lockee_Level: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Lockee_Longest_Lock: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "In seconds"
      },
      Lockee_Completed_Locks: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
      
    },{sequelize}
    );

    CKStat.associate = (models) => {
      CKStat.hasOne(models.User, {foreignKey: "User_ID"});
    };
    return CKStat;
  }