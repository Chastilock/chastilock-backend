const { gql } = require('apollo-server')

const typeDefs = gql`
  type User {
    User_ID: ID!
    UUID: String!
    Email: String
    Password: String
    Username: String
    CreatedLocks: [CreatedLock]!
    Sessions: [Session]!
  }
  type CreatedLock {
    Lock_ID: ID!
    User: User!
    Lock_Type: Int!
    Lock_Name: String
    Disabled: Int!
    Fixed_Length: Int
    Variable_Max_Greens: Int
    Variable_Max_Reds: Int
    Variable_Max_Freezes: Int
    Variable_Max_Doubles: Int
    Variable_Max_Stickies: Int
    Variable_Max_AddRed: Int
    Variable_Max_RemoveRed: Int
    Variable_Max_RandomRed: Int
    Variable_Min_Reds: Int
    Variable_Min_Freezes: Int
    Variable_Min_Doubles: Int
    Variable_Min_Stickies: Int
    Variable_Min_AddRed: Int
    Variable_Min_RemoveRed: Int
    Variable_Min_RandomRed: Int
  }
  type App {
    App_ID: Int
    Name: String
    API_Key: String
    API_Secret: String
  }

  type Session {
    Session_ID: Int!
    User: User!
    Token: String!
    App: App!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. 
  type Query {
    allUsers: [User!]!
    allCreatedLocks: [CreatedLock!]!
    createdLock(id: Int!): CreatedLock
  }

  type Mutation {
    createUser(APIKey: String!, APISecret: String!, Email: String!, Password: String!, Username: String!): User!
    createUserAnon(APIKey: String!, APISecret: String!): User!
    loginAnon(APIKey: String!, APISecret: String!, UUID: String!): Session!
    login(APIKey: String!, APISecret: String!, Username: String!, Password: String!): Session!
    changePassword(APIKey: String!, APISecret: String!, Token: String!, OldPassword: String!, NewPassword: String!): User!
  }
`;

module.exports = typeDefs