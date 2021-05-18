const { sequelize, dataTypes, checkModelName, checkPropertyExists, checkUniqueIndex } = require('sequelize-test-helpers');
const AppModel = require('../../models/App');
const chai = require('chai');
const { expect } = require('chai');
const sinonChai = require('sinon-chai')

chai.use(sinonChai);


describe('Test App Model', () => {
    const Model = AppModel(sequelize, dataTypes);
    const instance = new Model()
    checkModelName(Model)('App')

    context('properties', () => {
      ;['App_ID', 'Name', 'API_Key', 'API_Secret'].forEach(checkPropertyExists(instance))
    })

    context('indexes', () => {
      ;['Name', 'API_Key', 'API_Secret'].forEach(checkUniqueIndex(instance))
    })

    /* context('check associations', () => {
      const OtherModel = 'Sessions' // it doesn't matter what
      before(() => {
        Model.associate({ OtherModel })
      })

      it('defined a belongsTo association with SessionModel', () => {
        expect(Model.hasMany).to.have.been.calledWith(OtherModel)
      })
    }) */
  });