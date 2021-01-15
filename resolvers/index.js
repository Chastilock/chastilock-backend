const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');
const LoginAnon = require('../mutations/loginAnon');
const Login = require('../mutations/login');

const resolvers = {
  Query: {     
    async allUsers (root, args, { models }) {
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
    async createUser(root, args, { models }){
      return CreateUser(args, models);
    },
    async createUserAnon(root, args, { models }) {
      return CreateUserAnon(args, models);
    },
    async loginAnon(root, args, { models }) {
      return LoginAnon(args, models)
    },
    async login(root, args, { models }) {
      return Login(args, models);
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