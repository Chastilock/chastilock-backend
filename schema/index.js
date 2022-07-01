const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type User {
    User_ID: ID!
    UUID: String!
    Email: String
    Username: String
    Keyholder: Boolean
    Lockee: Boolean
	  Emergency_Keys: Int
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
    Checkins_Enabled:Boolean!
    Checkins_Frequency:Float
    Checkins_Window:Float
    Allow_Buyout:Boolean!
    Start_Lock_Frozen:Boolean!
    Disable_Keyholder_Decision:Boolean!
    Limit_Users:Boolean!
    User_Limit_Amount:Int
    Block_Test_Locks:Boolean!
    Block_User_Rating_Enabled:Boolean!
    Block_User_Rating:Int
    Block_Already_Locked:Boolean!
    Block_Stats_Hidden:Boolean!
    Only_Accept_Trusted:Boolean!
    Require_DM:Boolean!
  }
  type OriginalLockType {
    Original_Deck_ID: ID!
    Lock: CreatedLock!
    Variable_Max_Greens: Int!
    Variable_Max_Reds: Int!
    Variable_Max_Freezes: Int!
    Variable_Max_Doubles: Int!
    Variable_Max_Resets: Int!
    Variable_Max_Stickies: Int!
    Variable_Max_AddRed: Int!
    Variable_Max_RemoveRed: Int!
    Variable_Max_RandomRed: Int!
    Variable_Min_Greens: Int!
    Variable_Min_Reds: Int!
    Variable_Min_Freezes: Int!
    Variable_Min_Doubles: Int!
    Variable_Min_Resets: Int!
    Variable_Min_Stickies: Int!
    Variable_Min_AddRed: Int!
    Variable_Min_RemoveRed: Int!
    Variable_Min_RandomRed: Int!
    Chance_Period:Int!
    Cumulative:Boolean!
    Multiple_Greens_Required:Boolean!
    Hide_Card_Info:Boolean!
    Auto_Resets_Enabled:Boolean!
    Reset_Frequency:Int
    Max_Resets:Int
  }

  type TimerLockType {
    Timer_Type_ID: Int!
    Max_Days: Int!
    Max_Hours: Int!
    Max_Minutes: Int!
    Min_Days: Int!
    Min_Hours: Int!
    Min_Minutes: Int!
    Hide_Timer: Boolean!
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
    App: App!,
    Notification_Token: String
  }

  type LoadedLock {
    LoadedLock_ID: Int!
    CreatedLock: CreatedLock
    Lockee: User!
    Keyholder: User
    Code: String!
    Original_Lock_Deck: LoadedOriginalLock
    Timed_Unlock_Time: String
    Earliest_Unlock_Time: String
    Seconds_Remaining: Int
    Hide_Info: Boolean!
    Emergency_Keys_Enabled: Boolean!
    Emergency_Keys_Amount: Int
    Test_Lock: Boolean!
    Trusted: Boolean!
    Last_KH_Change: String
    CurrentFreeze: Freeze
    Unlocked: Boolean!
    Lockee_Rating: Int
    Keyholder_Rating: Int
    Free_Unlock: Boolean!
    Real_Lock: Int
  }

  type LoadedOriginalLock {
    Original_Loaded_ID: Int!
    Remaining_Red: Int!
    Remaining_Green: Int!
    Found_Green: Int!
    Multiple_Greens_Required: Boolean!
    Remaining_Sticky: Int!
    Remaining_Add1: Int!
    Remaining_Add2: Int!
    Remaining_Add3: Int!
    Remaining_Remove1: Int!
    Remaining_Remove2: Int!
    Remaining_Freeze: Int!
    Remaining_Double: Int!
    Remaining_Reset: Int!
    Remaining_GoAgain: Int!
    Cumulative: Boolean!
    Hide_Card_Info: Boolean!
    Chance_Period: Int!
    Chances_Remaining: Int!
    Chances_Last_Awarded: String!
    Last_Drawn: String
    Auto_Resets_Paused: Boolean
    Auto_Resets_Frequency: Int
    Auto_Resets_Time_Left: Int
    Last_Auto_Reset: String

  }
  type Freeze {
    Freeze_ID: Int!
    Lock: LoadedLock!
    Type: String!
    Started: String!
    EndTime: String
  }
  type UserSetting {
    Setting_ID: Int!
    User: User!
    Combo_Type: String!
    Allow_Duplicate_Characters: Boolean!
    Combo_Length: Int!
    Show_Combo_To_Keyholder: Boolean!
    Share_Stats: Boolean!
  }

  enum CardType {
    GREEN
    RED
    STICKY
    YELLOW_PLUS1
    YELLOW_PLUS2
    YELLOW_PLUS3
    YELLOW_MINUS1
    YELLOW_MINUS2
    FREEZE
    DOUBLE
    RESET
    GO_AGAIN
  }

  input DeckInput {
    GREEN: Int!
    RED: Int!
    STICKY: Int!
    YELLOW_PLUS1: Int!
    YELLOW_PLUS2: Int!
    YELLOW_PLUS3: Int!
    YELLOW_MINUS1: Int!
    YELLOW_MINUS2: Int!
    FREEZE: Int!
    DOUBLE: Int!
    RESET: Int!
  }

  type Deck {
    GREEN: Int
    RED: Int
    STICKY: Int
    YELLOW_PLUS1: Int
    YELLOW_PLUS2: Int
    YELLOW_PLUS3: Int
    YELLOW_MINUS1: Int
    YELLOW_MINUS2: Int
    FREEZE: Int
    DOUBLE: Int
    RESET: Int
    GO_AGAIN: Int
    TOTAL: Int #just to see how this works
  }
  type Bot {
    Bot_ID: Int!
    Bot_Name: String!
    Bot_Blurb: String!
    Bot_Difficulty: String!
  }
  type PasswordReset {
    PasswordReset_ID: Int!
    User: User!
    Expires: String!,
    Last_Emailed: String!
  }

  type Query {
    allUsers: [User!]!
    allCreatedLocks: [CreatedLock!]!
    createdLock(id: Int!): CreatedLock
    User(id: Int!): User
    Session(id: Int!): Session
    LoadedLock(id: Int!): LoadedLock
    getSharedLockByShareCode(ShareCode: String!): CreatedLock!
    PasswordReset(id: Int!): PasswordReset
    #Prod Queries!!
    myLoadedLocks: [LoadedLock!]!
    myCreatedLocks: [CreatedLock!]!
    sharedLock(id: String!): CreatedLock!
    me: User!
  }

  type Mutation {
    createUser(Email: String!, Password: String!, Username: String!): User!
    createUserAnon: User!
    loginAnon(UUID: String!): Session!
    login(Username: String!, Password: String!): Session!
    changePassword(OldPassword: String!, NewPassword: String!): User!
    upgradeAccount(Email: String!, Password: String!, Username: String!): User!
    logout: String!
    createOriginalLock(LockName: String, Shared: Boolean!, Variable_Max_Greens: Int!, Variable_Max_Reds: Int!, Variable_Max_Freezes: Int!, Variable_Max_Doubles: Int!, Variable_Max_Resets: Int!, Variable_Max_Stickies: Int!, Variable_Max_AddRed: Int!, Variable_Max_RemoveRed: Int!, Variable_Max_RandomRed: Int!, Variable_Min_Greens: Int!, Variable_Min_Reds: Int!, Variable_Min_Freezes: Int!, Variable_Min_Doubles: Int!, Variable_Min_Resets: Int!, Variable_Min_Stickies: Int!, Variable_Min_AddRed: Int!, Variable_Min_RemoveRed: Int!, Variable_Min_RandomRed: Int!, Chance_Period: Int!,  Cumulative: Boolean!, Multiple_Greens_Required: Boolean!, Hide_Card_Info: Boolean!, Allow_Fakes: Boolean!, Min_Fakes: Int, Max_Fakes: Int, Auto_Resets_Enabled: Boolean!, Reset_Frequency: Int, Max_Resets: Int, Checkins_Enabled: Boolean!, Checkins_Frequency: Float, Checkins_Window: Float, Allow_Buyout: Boolean!, Start_Lock_Frozen: Boolean!, Disable_Keyholder_Decision: Boolean!, Limit_Users: Boolean!, User_Limit_Amount: Int, Block_Test_Locks: Boolean!, Block_User_Rating_Enabled: Boolean!, Block_User_Rating: Int, Block_Already_Locked: Boolean!, Block_Stats_Hidden: Boolean!, Only_Accept_Trusted: Boolean!, Require_DM: Boolean!): CreatedLock!
    editOriginalLock(Lock_ID: Int!, LockName: String, Shared: Boolean, Variable_Max_Greens: Int, Variable_Max_Reds: Int, Variable_Max_Freezes: Int, Variable_Max_Doubles: Int, Variable_Max_Resets: Int, Variable_Max_Stickies: Int, Variable_Max_AddRed: Int, Variable_Max_RemoveRed: Int, Variable_Max_RandomRed: Int, Variable_Min_Greens: Int, Variable_Min_Reds: Int, Variable_Min_Freezes: Int, Variable_Min_Doubles: Int, Variable_Min_Resets: Int, Variable_Min_Stickies: Int, Variable_Min_AddRed: Int, Variable_Min_RemoveRed: Int, Variable_Min_RandomRed: Int, Chance_Period: Int,  Cumulative: Boolean, Multiple_Greens_Required: Boolean, Hide_Card_Info: Boolean, Allow_Fakes: Boolean, Min_Fakes: Int, Max_Fakes: Int, Auto_Resets_Enabled: Boolean, Reset_Frequency: Int, Max_Resets: Int, Checkins_Enabled: Boolean, Checkins_Frequency: Float, Checkins_Window: Float, Allow_Buyout: Boolean, Start_Lock_Frozen: Boolean, Disable_Keyholder_Decision: Boolean, Limit_Users: Boolean, User_Limit_Amount: Int, Block_Test_Locks: Boolean, Block_User_Rating_Enabled: Boolean, Block_User_Rating: Int, Block_Already_Locked: Boolean, Block_Stats_Hidden: Boolean, Only_Accept_Trusted: Boolean, Require_DM: Boolean): CreatedLock!
    createTimerLock(LockName: String, Shared: Boolean!, Allow_Fakes: Boolean!, Min_Fakes: Int, Max_Fakes: Int, Timer_Min_Days: Int!,Timer_Min_Hours: Int!,Timer_Min_Minutes: Int!, Timer_Max_Days: Int!,Timer_Max_Hours: Int!,Timer_Max_Minutes: Int!, Hide_Timer:Boolean!, Checkins_Enabled: Boolean!, Checkins_Frequency: Float, Checkins_Window: Float, Allow_Buyout: Boolean!, Start_Lock_Frozen: Boolean!, Disable_Keyholder_Decision: Boolean!, Limit_Users: Boolean!, User_Limit_Amount: Int, Block_Test_Locks: Boolean!, Block_User_Rating_Enabled: Boolean!, Block_User_Rating: Int, Block_Already_Locked: Boolean!, Block_Stats_Hidden: Boolean!, Only_Accept_Trusted: Boolean!, Require_DM: Boolean!): CreatedLock!
    loadLock(ShareCode: String!, Code: String, Min_Fakes: Int, Max_Fakes: Int, Trust_Keyholder: Boolean!, Sent_DM: Boolean, Emergency_Keys: Boolean!, Emergency_Keys_Amount: Int, Test_Lock: Boolean!): [LoadedLock!]!
    changeUserSettings(Allow_Duplicate_Characters: Boolean!, Show_Combo_To_Keyholder: Boolean!, Share_Stats: Boolean!): UserSetting!
    KHUnfreeze(LoadedLock_ID: Int!) : LoadedLock!
    KHReset(LoadedLock_ID: Int!): LoadedLock!
    KHFreeze(LoadedLock_ID: Int!, EndTime: String): LoadedLock!
    emergencyUnlock(Lock_ID: Int): LoadedLock!
    applyCard(LoadedLock_ID: Int!, Card: CardType!): LoadedLock!
    KHEditCards(LoadedLock_ID: Int!, Deck: DeckInput!, HiddenUpdate: Boolean!) : LoadedLock!
    registerNotifictions(NotificationToken: String!): Session!
    deregisterNotifictions: Session!
    requestPasswordChange(Email: String!): PasswordReset!
  }`;

module.exports = typeDefs
