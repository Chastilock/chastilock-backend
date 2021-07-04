const { LoadedLock, Freeze } = require('../models')

/**
 * Calculates the number of minutes in a time period expressed in days, hours, and minutes.
 * @param {int} days 
 * @param {int} hours 
 * @param {int} minutes 
 * @returns {int} The number of minutes in the time period
 */
function calculateMinutes (days, hours, minutes) {
  return (days * 24 + hours) * 60 + minutes
}

/**
 * This function returns the number of seconds until the eariest time that a timed lock could unlock, 
 * or null in the case of a card lock.  If the lock is not frozen, it returns seconds until the EndTime.
 * If it is frozen then that is seconds until the EndTime in the database plus the current length of the
 * keyholder freeze which will be added when the lock is unfrozen.
 * @param {LoadedLock} lock
 * @returns {int} - the number of seconds until the earliest time that the lock can unlock
 */
async function remainingSeconds (lock) {
  if (!lock.Timed_Unlock_Time) { // card lock
    return null
  }
  if (lock.Current_Freeze_ID) { // lock currently frozen
    const freeze = await Freeze.findByPk(lock.Current_Freeze_ID)
    if (!freeze) {
      throw new Error ("DB error: No freeze record found for a frozen lock")
    }
    // lock.Timed_Unlock_Time - freezeStarted is the time that remained when the lock was frozen.  
    return Math.floor ((lock.Timed_Unlock_Time.getTime() - freeze.Started.getTime())/1000)
  } else { // lock not currently frozen
    return Math.floor((lock.Timed_Unlock_Time.getTime() - Date.now()) / 1000)
  }
}

/**
 * Returns the earliest time that a timed lock could unlock or null for a card lock.  For a 
 * timed lock, the earliest time is calculated by examining the endtime in the database along 
 * with any existing freeze.
 * @param {LoadedLock} lock
 * @returns { Date }
 */
async function earliestEndTime(lock) {
  if (!lock.Timed_Unlock_Time) { // card lock
    return null
  }
  if (lock.Current_Freeze_ID) { // lock currently frozen
    const freeze = await Freeze.findByPk(lock.Current_Freeze_ID)
    if (!freeze) {
      throw new Error ("DB error: No freeze record found for a frozen lock")
    }
    // Date.now() - freeze.Started is current length of freeze sofar, and this is the amount that
    // end time would be extended by, if the freeze ended now.
    const storedTime = lock.Timed_Unlock_Time.getTime()
    const freezeStartTime = freeze.Started.getTime()
    const earliestTime = storedTime - freezeStartTime + Date.now()
    return new Date(earliestTime)
  } else { // lock not currently frozen
    return lock.Timed_Unlock_Time
  }
}

module.exports = {
  calculateMinutes,
  remainingSeconds,
  earliestEndTime
  }
