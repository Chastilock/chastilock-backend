module.exports = {
  
  Lock: {
    User: (parent, args, context, info) => parent.getUser(),
  },
  User: {
    Locks: (parent, args, context, info) => parent.getLocks(),
  },
  Query: {
    User: (parent, args, { db }, info) => db.User.findAll(),
    Locks: (parent, args, { db }, info) => db.Lock.findAll()
  }
}