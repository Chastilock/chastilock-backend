const { gql } = require('apollo-server-express')

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
    Lock_Type: String!
    Lock_Type_ID: Int!
    Lock_Name: String
    Disabled: Boolean!
    OriginalLockType: OriginalLockType
    
  }
  type OriginalLockType {
    Original_Deck_ID: ID!,
    Lock: CreatedLock!,
    Variable_Max_Greens: Int!
    Variable_Max_Reds: Int!
    Variable_Max_Freezes: Int!
    Variable_Max_Doubles: Int!
    Variable_Max_Stickies: Int!
    Variable_Max_AddRed: Int!
    Variable_Max_RemoveRed: Int!
    Variable_Max_RandomRed: Int!
    Variable_Min_Greens: Int!
    Variable_Min_Reds: Int!
    Variable_Min_Freezes: Int!
    Variable_Min_Doubles: Int!
    Variable_Min_Stickies: Int!
    Variable_Min_AddRed: Int!
    Variable_Min_RemoveRed: Int!
    Variable_Min_RandomRed: Int!
    Chance_Period:Int!
    Cumalative:Int!
    Multiple_Greens_Required:Int!
    Hide_Card_Info:Int!
    Allow_Fakes:Int!
    Min_Fakes:Int
    Max_Fakes:Int
    Auto_Resets_Enabled:Int!
    Reset_Frequency:Int
    Max_Resets:Int
    Checkins_Enabled:Int!
    Checkins_Frequency:Int
    Checkins_Window:Int
    Allow_Buyout:Int!
    Start_Lock_Frozen:Int!
    Disable_Keyholder_Decision:Int!
    Limit_Users:Int!
    User_Limit_Amount:Int!
    Block_Test_Locks:Int!
    Block_User_Rating_Enabled:Int!
    Block_User_Rating:Int
    Block_Already_Locked:Int!
    Block_Stats_Hidden:Int!
    Only_Accept_Trusted:Int!
    Require_DM:Int!
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

  type LoadedLock {
    LoadedLock_ID: Int!,
    CreatedLock: CreatedLock!,
    Lockee: User!,
    Keyholder: User,
    Code: Int!
  }

  type LoadedOriginalLock {
    Original_Loaded_ID: Int!,
    Remaining_Red: Int!
    Remaining_Green: Int!,
    Found_Green: Int!,
    Remaining_Sticky: Int!,
    Remaining_Add1: Int!,
    Remaining_Add2: Int!,
    Remaining_Add3: Int!,
    Remaining_Remove1: Int!,
    Remaining_Remove2: Int!,
    Remaining_Freeze: Int!,
    Remaining_Double: Int!,
    Remaining_Reset: Int!,
    Cumulative: Boolean!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. 
  type Query {
    allUsers: [User!]!
    allCreatedLocks: [CreatedLock!]!
    createdLock(id: Int!): CreatedLock
    User(id: Int!): User,
    Session(id: Int!): Session
    LoadedLock(id: Int!): LoadedLock
  }

  type Mutation {
    createUser(Email: String!, Password: String!, Username: String!): User!
    createUserAnon: User!
    loginAnon(UUID: String!): Session!
    login(Username: String!, Password: String!): Session!
    changePassword(OldPassword: String!, NewPassword: String!): User!
    upgradeAccount(Email: String!, Password: String!, Username: String!): User!
    logout: String!
    createOriginalLock(LockName: String, Variable_Max_Greens: Int!, Variable_Max_Reds: Int!, Variable_Max_Freezes: Int!, Variable_Max_Doubles: Int!, Variable_Max_Stickies: Int!, Variable_Max_AddRed: Int!, Variable_Max_RemoveRed: Int!, Variable_Max_RandomRed: Int!, Variable_Min_Greens: Int!, Variable_Min_Reds: Int!, Variable_Min_Freezes: Int!, Variable_Min_Doubles: Int!, Variable_Min_Stickies: Int!, Variable_Min_AddRed: Int!, Variable_Min_RemoveRed: Int!, Variable_Min_RandomRed: Int!, Chance_Period: Int!, Cumalative: Int!, Multiple_Greens_Required: Int!, Hide_Card_Info: Int!, Allow_Fakes: Int!, Min_Fakes: Int, Max_Fakes: Int, Auto_Resets_Enabled: Int!, Reset_Frequency: Int, Max_Resets: Int, Checkins_Enabled: Int!, Checkins_Frequency: Int, Checkins_Window: Int, Allow_Buyout: Int!, Start_Lock_Frozen: Int!, Disable_Keyholder_Decision: Int!, Limit_Users: Int!, User_Limit_Amount: Int!, Block_Test_Locks: Int!, Block_User_Rating_Enabled: Int!, Block_User_Rating: Int, Block_Already_Locked: Int!, Block_Stats_Hidden: Int!, Only_Accept_Trusted: Int!, Require_DM: Int!): CreatedLock!
  }`;

module.exports = typeDefs