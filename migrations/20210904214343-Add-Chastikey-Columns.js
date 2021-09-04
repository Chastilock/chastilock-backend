'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("Users", "Joined_CK_Timestamp", {
        type: Sequelize.DATE,
        allowNull: true,
        after: "Emergency_Keys"
    });

    queryInterface.addColumn("Users", "CK_Username", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "Joined_CK_Timestamp"
    });
    
    queryInterface.addColumn("Users", "CK_UserID", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "CK_Username"
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("Users", "Joined_CK_Timestamp");
    queryInterface.removeColumn("Users", "CK_Username");
    queryInterface.removeColumn("Users", "CK_UserID");
  }
};
