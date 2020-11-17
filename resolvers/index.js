const resolvers = {
  Query: {     
    async allUsers (root, args, { models }) {
      return models.User.findAll();
    },
    async allLocks (root, args, { models }) {
      return models.Lock.findAll();
    },
    async lock (root, { id }, { models }) {
      return models.Lock.findByPk(id)
    }
  },
  User: {
    async Locks (user) {
      return user.getLocks()
    }
  },
  Lock: {
    async User (lock) {
      return lock.getUser()
    }
  }
}
module.exports = resolvers