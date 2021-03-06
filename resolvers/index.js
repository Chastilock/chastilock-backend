const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');
const LoginAnon = require('../mutations/loginAnon');
const Login = require('../mutations/login');
const changePassword = require('../mutations/changePassword');
const upgradeAccount = require('../mutations/upgradeAccount');
const Logout = require('../mutations/logout');
const createOriginalLock = require('../mutations/createOriginalLock');

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
      const model = models.CreatedLock.findByPk(id);
      model.OriginalLockType = models.OriginalLockType.findByPk(model.OriginalLockType_ID);
      return model;
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
    }
  },

  User: {
    async CreatedLocks (user) {
      return user.getCreatedLocks()
    }
  },
  CreatedLock: {
    async User (CreatedLock) {
      return CreatedLock.getUser()
    }
  }
}
module.exports = resolvers