const CreatedLock = require("../models/CreatedLock");
const CreateUser = require('../mutations/createUser');


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
      return CreateUser(args);
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