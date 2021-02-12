const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');
const LoginAnon = require('../mutations/loginAnon');
const Login = require('../mutations/login');
const changePassword = require('../mutations/changePassword');

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
      return models.CreatedLock.findByPk(id)
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
      return LoginAnon(args, models)
    },
    async login(root, args, { models }) {
      return Login(args, models);
    },
    async changePassword(root, args, { models, req }) {
      return changePassword(args, models, req);
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