const { LoadedLock, Freeze, CreatedLock, LoadedOriginalLock, TimerLockType } = require("../models");
const { loadOriginalLockType} = require("./loadOriginalLockType")
const { calculateMinutes } = require("./timeFunctions")
const { RandomInt } = require('./random')

/**
 * This function does a hard reset, that is, it resets ALL cards based on the original distribution
 * specified in the original CreatedLock template.  A hard reset can be either an auto-reset or a keyholder
 * reset, but not a card reset, which is a soft reset.  This function uses loadOriginalLockType to create a
 * new deck (LoadedOriginalLock) and then copies the card information from the new deck into the old deck without
 * modifying other fields, and then cleans up by saving the modified old deck and deleting the new deck.
 * @param { LoadedLock } lock 
 * @returns { void }
 */
async function hardResetLock(lock) {
    // reset should unfreeze lock if frozen
    if (lock.Current_Freeze_ID) {
        unfreezeLock(lock)
    }

    /** @type CreatedLock */
    const createdLock = await CreatedLock.findByPk(lock.CreatedLock_ID);

    if (lock.Original_Lock_Deck) { // variable/card lock
        // get old deck
        /** @type LoadedOriginalLock */
        oldDeck = await LoadedOriginalLock.findByPk(lock.Original_Lock_Deck)

        // create new deck
        /** @type LoadedOriginalLock */
        newDeck = await loadOriginalLockType(createdLock)

        // copy card info from new deck to old deck, save the old deck and then delete the new deck 
        oldDeck.Remaining_Red = newDeck.Remaining_Red
        oldDeck.Remaining_Green = newDeck.Remaining_Green
        oldDeck.Found_Green = 0
        oldDeck.Remaining_Sticky = newDeck.Remaining_Sticky
        oldDeck.Remaining_Add1 = newDeck.Remaining_Add1
        oldDeck.Remaining_Add2 = newDeck.Remaining_Add2
        oldDeck.Remaining_Add3 = newDeck.Remaining_Add3
        oldDeck.Remaining_Remove1 = newDeck.Remaining_Remove1
        oldDeck.Remaining_Remove2 = newDeck.Remaining_Remove2
        oldDeck.Remaining_Freeze = newDeck.Remaining_Freeze
        oldDeck.Remaining_Double = newDeck.Remaining_Double
        oldDeck.Remaining_Reset = newDeck.Remaining_Reset
        oldDeck.Remaining_GoAgain = newDeck.Remaining_GoAgain
        oldDeck.Chances_Remaining = 1
        oldDeck.Chances_Last_Calulated = Date.now()
        // other fields in oldDeck may have been modified from original settings, so not copied.
        await oldDeck.save()
        // delete new deck from DB
        await newDeck.destroy()
    } else if (lock.Timed_Unlock_Time) { 
        /** @type {TimerLockType} */
        timed = await TimerLockType.findByPk(createdLock.TimerLockType_ID);
        minTime = calculateMinutes(timed.Min_Days, timed.Min_Hours, timed.Min_Minutes)
        maxTime = calculateMinutes(timed.Max_Days, timed.Max_Hours, timed.Max_Minutes)
        lockLength = await RandomInt(minTime, maxTime) //minutes
        lock.Timed_Unlock_Time = Date.now() + lockLength * 60000 // 60000 milliseconds per minute
        await lock.save()
    } else { // ? neither timed nor variable - should never happen, but...
        throw Error("DB Error: lock is has neither a deck nor an unlock time")
    }
}

/**
 * Unfreezes a Loaded 
 * @param { LoadedLock } lock 
 * @returns { void }
 */
async function unfreezeLock(lock) {
    /** @type { Freeze } */
    const freeze = await Freeze.findByPk(lock.Current_Freeze_ID)
    if (!freeze) { // freeze supposed to exist, but not found in DB
        // TODO: ??? fix by setting LockSearch.Current_Freeze_ID = undefined and saving ???
        throw new Error("DB error: Lock is frozen, but freeze record does not exist.")
    }
    // record end time, but don't delete freeze record, so we can calculate total freeze time
    freeze.EndTime = Date.now() 
    await freeze.save()
    if (lock.Timed_Unlock_Time) { // timed lock
        const freezelength = freeze.EndTime - freeze.Started // milliseconds
        const oldUnlockTime = lock.Timed_Unlock_Time.getTime() // msecs since epoch
        lock.Timed_Unlock_Time = new Date(freezelength + oldUnlockTime)
    }
    // unlink the lock from the freeze to unfreeze it
    lock.Current_Freeze_ID = null
    await lock.save()
}

module.exports = {
    hardResetLock,
    unfreezeLock
}
