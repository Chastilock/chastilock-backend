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
    Shared: Boolean!
    Shared_Code: String!
    Lock_Name: String
    Disabled: Boolean!
    OriginalLockType: OriginalLockType
    Allow_Fakes:Boolean!
    Min_Fakes:Int
    Max_Fakes:Int
    Auto_Resets_Enabled:Boolean!
    Reset_Frequency:Int
    Max_Resets:Int
    Checkins_Enabled:Boolean!
    Checkins_Frequency:Int
    Checkins_Window:Int
    Allow_Buyout:Boolean!
    Disable_Keyholder_Decision:Boolean!
    Limit_Users:Boolean!
    User_Limit_Amount:Int!
    Block_Test_Locks:Boolean!
    Block_User_Rating_Enabled:Boolean!
    Block_User_Rating:Int
    Block_Already_Locked:Boolean!
    Block_Stats_Hidden:Boolean!
    Only_Accept_Trusted:Boolean!
    Require_DM:Boolean!
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
    Cumulative:Boolean!
    Multiple_Greens_Required:Boolean!
    Hide_Card_Info:Boolean!
    Start_Lock_Frozen:Boolean!
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
    LoadedLock_ID: Int!
    CreatedLock: CreatedLock!
    Lockee: User!
    Keyholder: User
    Code: String!
    Emergency_Keys: Boolean!
    Emergency_Keys_Amount: Int
    Test_Lock: Boolean!,
    CurrentFreeze: Freeze,
    Unlocked: Boolean!
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
  type Freeze {
    Freeze_ID: Int!,
    Lock: LoadedLock!,
    Type: String!,
    Started: Int!,
    EndTime: Int
  }

  type Query {
    allUsers: [User!]!
    allCreatedLocks: [CreatedLock!]!
    createdLock(id: Int!): CreatedLock
    User(id: Int!): User,
    Session(id: Int!): Session
    LoadedLock(id: Int!): LoadedLock
    #Prod Queries!!
    myLoadedLocks: [LoadedLock!]!
    myCreatedLocks: [CreatedLock!]!
    sharedLock(id: String!): CreatedLock!
  }

  type Mutation {
    createUser(Email: String!, Password: String!, Username: String!): User!
    createUserAnon: User!
    loginAnon(UUID: String!): Session!
    login(Username: String!, Password: String!): Session!
    changePassword(OldPassword: String!, NewPassword: String!): User!
    upgradeAccount(Email: String!, Password: String!, Username: String!): User!
    logout: String!
    createOriginalLock(LockName: String, Shared: Boolean!, Variable_Max_Greens: Int!, Variable_Max_Reds: Int!, Variable_Max_Freezes: Int!, Variable_Max_Doubles: Int!, Variable_Max_Stickies: Int!, Variable_Max_AddRed: Int!, Variable_Max_RemoveRed: Int!, Variable_Max_RandomRed: Int!, Variable_Min_Greens: Int!, Variable_Min_Reds: Int!, Variable_Min_Freezes: Int!, Variable_Min_Doubles: Int!, Variable_Min_Stickies: Int!, Variable_Min_AddRed: Int!, Variable_Min_RemoveRed: Int!, Variable_Min_RandomRed: Int!, Chance_Period: Int!,  Cumulative: Boolean!, Multiple_Greens_Required: Boolean!, Hide_Card_Info: Boolean!, Allow_Fakes: Boolean!, Min_Fakes: Int, Max_Fakes: Int, Auto_Resets_Enabled: Boolean!, Reset_Frequency: Int, Max_Resets: Int, Checkins_Enabled: Boolean!, Checkins_Frequency: Int, Checkins_Window: Int, Allow_Buyout: Boolean!, Start_Lock_Frozen: Boolean!, Disable_Keyholder_Decision: Boolean!, Limit_Users: Boolean!, User_Limit_Amount: Int, Block_Test_Locks: Boolean!, Block_User_Rating_Enabled: Boolean!, Block_User_Rating: Int, Block_Already_Locked: Boolean!, Block_Stats_Hidden: Boolean!, Only_Accept_Trusted: Boolean!, Require_DM: Boolean!): CreatedLock!
    createTimerLock(LockName: String, Shared: Boolean!, Allow_Fakes: Boolean!, Timer_Min_Days: Int!,Timer_Min_Hours: Int!,Timer_Min_Minutes: Int!, Timer_Max_Days: Int!,Timer_Max_Hours: Int!,Timer_Max_Minutes: Int!, Hide_Timer:Boolean!, Auto_Resets_Enabled: Boolean!, Reset_Frequency: Int, Max_Resets: Int, Checkins_Enabled: Boolean!, Checkins_Frequency: Int, Checkins_Window: Int, Allow_Buyout: Boolean!, Start_Lock_Frozen: Boolean!, Disable_Keyholder_Decision: Boolean!, Limit_Users: Boolean!, User_Limit_Amount: Int, Block_Test_Locks: Boolean!, Block_User_Rating_Enabled: Boolean!, Block_User_Rating: Int, Block_Already_Locked: Boolean!, Block_Stats_Hidden: Boolean!, Only_Accept_Trusted: Boolean!, Require_DM: Boolean!): CreatedLock!
    loadLock(ShareCode: String!, Min_Fakes: Int, Max_Fakes: Int, Trust_Keyholder: Boolean!, Sent_DM: Boolean, Emergency_Keys: Boolean!, Emergency_Keys_Amount: Int, Test_Lock: Boolean!): LoadedLock!
    changeUserSettings(Allow_Duplicate_Characters: Boolean!, Show_Combo_To_Keyholder: Boolean!, Share_Stats: Boolean!): UserSetting!
  }`;

module.exports = typeDefs