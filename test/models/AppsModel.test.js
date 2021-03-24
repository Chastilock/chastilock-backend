const { sequelize, dataTypes, checkModelName, checkPropertyExists } = require('sequelize-test-helpers');
const AppModel = require('../../models/App')

describe('Test App Model', () => {
    const Model = AppModel(sequelize, dataTypes);
    const instance = new Model()
    checkModelName(Model)('App')
  });