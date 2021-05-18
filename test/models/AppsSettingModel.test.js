const { sequelize, dataTypes, checkModelName, checkPropertyExists, checkUniqueIndex } = require('sequelize-test-helpers');
const AppSettingsModel = require('../../models/AppSetting');

describe('Test AppSetting Model', () => {
    const Model = AppSettingsModel(sequelize, dataTypes);
    const instance = new Model()
    checkModelName(Model)('AppSetting')

    context('properties', () => {
      ;['AppSetting_ID', 'Setting_Name', 'Setting_Value'].forEach(checkPropertyExists(instance))
    })

    context('indexes', () => {
      ;['Setting_Name'].forEach(checkUniqueIndex(instance))
    })
  });