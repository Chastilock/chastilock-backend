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

module.exports = { calculateMinutes }