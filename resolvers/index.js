//Import mutations
const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');
const LoginAnon = require('../mutations/loginAnon');
const Login = require('../mutations/login');
const changePassword = require('../mutations/changePassword');
const upgradeAccount = require('../mutations/upgradeAccount');
const Logout = require('../mutations/logout');
const logoutAllSessions = require('../mutations/logoutAllSessions');
const createOriginalLock = require('../mutations/createOriginalLock');
const editOriginalLock = require('../mutations/editOriginalLock');
const createTimerLock = require('../mutations/createTimerLock');
const loadLock = require('../mutations/loadLock');
const changeUserSettings = require('../mutations/changeUserSettings');
const KHFreeze = require('../mutations/KHFreeze');
const emergencyUnlock = require('../mutations/emergencyUnlock');
const KHUnfreeze = require('../mutations/KHUnfreeze');
const KHReset = require('../mutations/KHReset');
const applyCard = require('../mutations/applyCard');
const { remainingSeconds, earliestEndTime } = require('../helpers/timeFunctions');
const KHEditCards = require('../mutations/KHEditCards');
const registerNotifictions = require('../mutations/registerNotifications');
const deregisterNotifictions = require('../mutations/deregisterNotifications');
const requestPasswordChange = require('../mutations/requestPasswordChange');

//Import queries
const myLoadedLocks = require('../queries/myLoadedLocks');
const myCreatedLocks = require('../queries/myCreatedLocks');
const sharedLock = require('../queries/sharedLock');
const me = require('../queries/me');


const resolvers = {
  Query: {     
    async allUsers (root, args, { req, models }) {
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
    async PasswordReset (root, { id }, { models }) {
      return models.PasswordReset.findByPk(id);
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
    async logoutAllSessions(root, args, { models, req }) {
      return logoutAllSessions(args, models, req);
    },
    async createOriginalLock(root, args, { models, req }) {
      return createOriginalLock(args, models, req);
    },
    async editOriginalLock(root, args, { models, req }) {
      return editOriginalLock(args, models, req);
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
    },
    async KHEditCards(root, args, {models, req}) {
      return KHEditCards(args, models, req);
    },
    async registerNotifictions(root, args, {models, req}) {
      return registerNotifictions(args, models, req);
    },
    async deregisterNotifictions(root, args, {models, req}) {
      return deregisterNotifictions(args, models, req);
    },
    async requestPasswordChange(root, args, {models, req}) {
      return requestPasswordChange(args, models, req);
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
    },
    async Earliest_Unlock_Time (LoadedLock) {
      return earliestEndTime(LoadedLock)
    },
    async Seconds_Remaining(LoadedLock) {
      return remainingSeconds(LoadedLock)
    }
  },
  Freeze: {
    async Lock (Freeze) {
      return Freeze.getLoadedLock();
    }
  },
  UserSetting: {
    async User (UserSetting) {
      return UserSetting.getUser();
    }
  },
  PasswordReset: {
    async User(PasswordReset) {
      return PasswordReset.getUser();
    }
  }
}
module.exports = resolvers