//Import mutations
const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');
const LoginAnon = require('../mutations/loginAnon');
const Login = require('../mutations/login');
const changePassword = require('../mutations/changePassword');
const upgradeAccount = require('../mutations/upgradeAccount');
const Logout = require('../mutations/logout');
const createOriginalLock = require('../mutations/createOriginalLock');
const loadLock = require('../mutations/loadLock');
//Import queries
const myLoadedLocks = require('../queries/myLoadedLocks');
const myCreatedLocks = require('../queries/myCreatedLocks');
const sharedLock = require('../queries/sharedLock');

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
    async login(root, args, { models }) {
      return Login(args, models);
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
    async loadLock(root, args, { models, req }) {
      return loadLock(args, models, req);
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
      return LoadedLock.getUser();
    },
    async Keyholder (LoadedLock) {
      return LoadedLock.getUser();
    },
    async CreatedLock (LoadedLock) {
      return LoadedLock.getCreatedLock();
    },
    async CurrentFreeze (LoadedLock) {
      return LoadedLock.getCurrentFreeze();
    }
  }

}
module.exports = resolvers