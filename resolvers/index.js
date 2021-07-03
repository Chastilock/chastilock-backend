//Import mutations
const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');
const LoginAnon = require('../mutations/loginAnon');
const Login = require('../mutations/login');
const changePassword = require('../mutations/changePassword');
const upgradeAccount = require('../mutations/upgradeAccount');
const Logout = require('../mutations/logout');
const createOriginalLock = require('../mutations/createOriginalLock');
const createTimerLock = require('../mutations/createTimerLock');
const loadLock = require('../mutations/loadLock');
const changeUserSettings = require('../mutations/changeUserSettings');
const KHFreeze = require('../mutations/KHFreeze');
const emergencyUnlock = require('../mutations/emergencyUnlock');
const KHUnfreeze = require('../mutations/KHUnfreeze');
const KHReset = require('../mutations/KHReset');
const applyCard = require('../mutations/applyCard')

//Import queries
const myLoadedLocks = require('../queries/myLoadedLocks');
const myCreatedLocks = require('../queries/myCreatedLocks');
const sharedLock = require('../queries/sharedLock');
const me = require('../queries/me');

const resolvers = {
  Query: {     
    async allUsers (root, args, { req, models }) {
      console.log(req.AppFound);
      return models.User.findAll();
    },
    async allCreatedLocks (root, args, { models }) {
      return models.CreatedLock.findAll();
    },
    async createdLock (root, { id }, { models }) {
      return models.CreatedLock.findByPk(id);
    },
    async User (root, { id }, { models }) {
      return models.User.findByPk(id);
    },
    async Session (root, { id }, { models }) {
      return models.Session.findByPk(id);
    },
    async LoadedLock (root, { id }, { models }) {
      return models.LoadedLock.findByPk(id);
    },
    //Prod Queries
    async myLoadedLocks(root, args, { models, req }) {
      return myLoadedLocks(models, req);
    },
    async myCreatedLocks(root, args, { models, req }) {
      return myCreatedLocks(models, req);
    },
    async sharedLock(root, args, {models, req}) {
      return sharedLock(models, req, args);
    },
    async me(root, args, {models, req}) {
      return me(models, req);
    }

  },

  Mutation: {
    async createUser(root, args, { models, req }){
      return CreateUser(args, models, req);
    },
    async createUserAnon(root, args, { models, req }) {
      return CreateUserAnon(models, req);
    },
    async loginAnon(root, args, { models, req }) {
      return LoginAnon(args, models, req);
    },
    async login(root, args, { models, req }) {
      return Login(args, models, req);
    },
    async changePassword(root, args, { models, req }) {
      return changePassword(args, models, req);
    },
    async upgradeAccount(root, args, { models, req }) {
      return upgradeAccount(args, models, req);
    },
    async logout(root, args, { models, req }) {
      return Logout(args, models, req);
    },
    async createOriginalLock(root, args, { models, req }) {
      return createOriginalLock(args, models, req);
    },
    async createTimerLock(root, args, { models, req }) {
      return createTimerLock(args, models, req);
    },
    async loadLock(root, args, { models, req }) {
      return loadLock(args, models, req);
    },
    async changeUserSettings(root, args, { models, req }) {
      return changeUserSettings(args, models, req);
    },
    async KHFreeze(root, args, { models, req }) {
      return KHFreeze(args, models, req);
    },
    async emergencyUnlock(root, args, { models, req }) {
      return emergencyUnlock(args, models, req);
    },
    async KHUnfreeze(root, args, {models, req}) {
      return KHUnfreeze(args, models, req);
    },
    async KHReset(root, args, {models, req}) {
      return KHReset(args, models, req);
    },
    async applyCard(root, args, {models, req}) {
      return applyCard(args, models, req);
    }
  },

  User: {
    async CreatedLocks (user) {
      return user.getCreatedLocks()
    },
    async Sessions (user) {
      return user.getSessions()
    }
  },
  CreatedLock: {
    async User (CreatedLock) {
      return CreatedLock.getUser()
    },
    async OriginalLockType (CreatedLock) {
      return CreatedLock.getOriginalLockType()
    }
  },
  OriginalLockType: {
    async Lock (OriginalLockType) {
      return OriginalLockType.getCreatedLock();
    }
  },
  Session: {
    async User (Session) {
      return Session.getUser();
    },
    async App (Session) {
      return Session.getApp();
    }
  },
  LoadedLock: {
    async Lockee (LoadedLock) {
      return LoadedLock.getLockeeUser();
    },
    async Keyholder (LoadedLock) {
      return LoadedLock.getKeyholderUser();
    },
    async CreatedLock (LoadedLock) {
      return LoadedLock.getCreatedLock(); //
    },
    async Original_Lock_Deck (LoadedLock) {
      return LoadedLock.getLoadedOriginalLock();
    },
    async CurrentFreeze (LoadedLock) {
      return LoadedLock.getFreeze();
    }
  },
  UserSetting: {
    async User (UserSetting) {
      return UserSetting.getUser();
    }
  }

}
module.exports = resolvers