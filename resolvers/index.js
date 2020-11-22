const CreateUser = require('../mutations/createUser');
const CreateUserAnon = require('../mutations/createUserAnon');

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