'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('LoadedLocks', 'Hide_Info', {
      type: Sequelize.BOOLEAN, 
      allowNull: false,
    });

    await queryInterface.addColumn('LoadedLocks', 'Free_Unlock', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: 'Keyholder_Rating'
    });

    await queryInterface.addColumn('LoadedLocks', 'Real_Lock', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'Free_Unlock',
      references: {
        model: 'LoadedLocks',
        key: 'LoadedLock_ID'
      }
    });

    await queryInterface.removeColumn('CreatedLocks', 'Auto_Resets_Enabled');
    await queryInterface.removeColumn('CreatedLocks', 'Reset_Frequency');
    await queryInterface.removeColumn('CreatedLocks', 'Max_Resets');

    await queryInterface.addColumn('OriginalLockTypes', 'Auto_Resets_Enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: 'Hide_Card_Info'
    });

    await queryInterface.addColumn('OriginalLockTypes', 'Reset_Frequency', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'Auto_Resets_Enabled'
    });

    await queryInterface.addColumn('OriginalLockTypes', 'Max_Resets', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'Reset_Frequency'
    });

    await queryInterface.addColumn('Freezes', 'Lock_ID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'Freeze_ID',
    });

    await queryInterface.changeColumn('Freezes', 'Started', {
      type: Sequelize.DATE, 
      allowNull: false,
    });

    await queryInterface.changeColumn('Freezes', 'EndTime', {
      type: Sequelize.DATE, 
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'Email_Validated', {
      type: Sequelize.BOOLEAN, 
      allowNull: true,
      after: 'Lockee',
    });

    await queryInterface.addColumn('Users', 'Validation_Code', {
      type: Sequelize.STRING, 
      allowNull: true,
      after: 'Email_Validated',
    });

    await queryInterface.addColumn('Users', 'Emergency_Keys', {
      type: Sequelize.INTEGER, 
      allowNull: true,
      after: 'Validation_Code',
    });  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Users','Emergency_Keys')
    await queryInterface.removeColumn('Users', 'Validation_Code')
    await queryInterface.removeColumn('Users', 'Email_Validated')

    await queryInterface.changeColumn('Freezes', 'EndTime', {
      type: Sequelize.TIME, 
      allowNull: true,
    });
    await queryInterface.changeColumn('Freezes', 'Started', {
      type: Sequelize.TIME, 
      allowNull: false,
    });
    await queryInterface.removeColumn('Freezes', 'Lock_ID');

    await queryInterface.removeColumn('OriginalLockTypes', 'Max_Resets');
    await queryInterface.removeColumn('OriginalLockTypes', 'Reset_Frequency');
    await queryInterface.removeColumn('OriginalLockTypes', 'Auto_Resets_Enabled');

    await queryInterface.addColumn('CreatedLocks', 'Auto_Resets_Enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      after: 'Max_Fakes'
    });
    await queryInterface.addColumn('CreatedLocks', 'Reset_Frequency', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'Auto_Resets_Enabled'
    });
    await queryInterface.addColumn('CreatedLocks', 'Max_Resets', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'Reset_Frequency'
    });

    await queryInterface.removeColumn('LoadedLocks', 'Real_Lock');
    await queryInterface.removeColumn('LoadedLocks', 'Free_Unlock');
    await queryInterface.changeColumn('LoadedLocks', 'Hide_Info', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
