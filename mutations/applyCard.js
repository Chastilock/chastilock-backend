const { AuthenticationError, ApolloError,  UserInputError } = require('apollo-server-express');
const { default: CardApplierManager } = require('chastilock-cardgame/dist/cards/CardApplierManager');
const { Freeze } = require('./../models/Freeze')
const { LoadedLock } = require("../models");
const applyCard = require('../helpers/cardApplierFunctions');
import { CardType } from 'graphql'

async function applyCard(inputs, models, req) {

  if(req.AppFound === false) {
    throw new AuthenticationError("App does not exist");
  }
  if(req.Authenticated === false) {
    throw new AuthenticationError("Session is not valid");
  }

  const LockSearch = await models.LoadedLock.findOne({
      where: {
          LoadedLockID: inputs.LoadedLock_ID
      }
  });

  if(!LockSearch) {
    throw new ApolloError("Lock is not found", 404);
  }

  // make sure Lockee is the person drawing the card
  if(LockSearch.Lockee != req.Authenticated) {
    throw new AuthenticationError("Access denied");
  }

  const validationErrors = [];

  // do we need code to check for autoresets here

  // how will chances be incremented

  if (LockSearch.Chances < 1) {
    validationErrors.push("The lockee has no chances");
  }

  // TODO: ?? Refactor to move the code to a helper function called ?isFrozen that will return boolean?
  // presumably the lockee wouldn't be drawing cards if frozen, but
  // it's possible a keyholder freeze may have just occurred
  let fr_ID = LockSearch.Current_Freeze_ID;
  if (fr_ID !== null)  { // freeze exists
    const freeze = await models.Freeze.findByPK(fr_ID);
    if (freeze === null) { // not found in Freezes table, so DB inconsistent
      // fix it?
      LockSearch.CurrentFreeze = null;
      await LockSearch.save();
    } else if (freeze.EndTime - Date.now() > 0) { // freeze has not yet expired
      validationErrors.push("The lock is currently frozen");
    } else {
      ;
      // TODO: ??? expired freeze 
      // does code to delete an expired card freeze belong here
      // or in another mutation where the app updates to check the status of a lock
      // or in some server cron job, or...
    }
  }

  applyCard(inputs.Card, LockSearch)

  return LockSearch
}

module.exports = loadLock;