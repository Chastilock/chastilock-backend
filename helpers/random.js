const randomNumber = require("random-number-csprng")
/* 
randomNumber in the above module throws error if min is equal to max  :(
          "stacktrace": [
            "RandomGenerationError: The maximum value must be higher than the minimum value.",
            "    at c:\\Users\\book1\\wk\\git\\chastilock-backend\\node_modules\\random-number-csprng\\lib\\index.js:72:10",
            "    at tryCatcher (c:\\Users\\book1\\wk\\git\\chastilock-backend\\node_modules\\bluebird\\js\\release\\util.js:16:23)",
            "    at Function.Promise.attempt.Promise.try (c:\\Users\\book1\\wk\\git\\chastilock-backend\\node_modules\\bluebird\\js\\release\\method.js:39:29)",
            "    at secureRandomNumber (c:\\Users\\book1\\wk\\git\\chastilock-backend\\node_modules\\random-number-csprng\\lib\\index.js:50:20)",
            "    at RandomInt (c:\\Users\\book1\\wk\\git\\chastilock-backend\\helpers\\random.js:3:18)",
            "    at loadOriginalLockType (c:\\Users\\book1\\wk\\git\\chastilock-backend\\helpers\\loadOriginalLockType.js:19:26)",
*/
 
async function RandomInt(min, max) {
    if (min == max) { 
      return min;
    } else {
    return await randomNumber(min, max);
    }
}

async function SplitNumberInto2Rand(Input) {  
  const Num1 = await RandomInt(0, Input);
  const Num2 = Input - Num1;

  return {
    Num1,
    Num2
  }
}
/* Unintended consequence - on average gives half to Num1, and 25% to each of the other two */
async function SplitNumberInto3Rand(Input) {  
  const Num1 = await RandomInt(0, Input);
  const Remaining = Input - Num1;
  const Num2 = await RandomInt(0, Remaining);
  const Num3 = Input - (Num1 + Num2)

  return {
    Num1,
    Num2,
    Num3
  }
}

/* Unintended consequence - On average gives 50% to Num1, 25% to Num2, 12.5% to Num3, 6.25% to Num4 & Num5 */
async function SplitNumberInto5Rand(Input) {  
  const Num1 = await RandomInt(0, Input);
  let Remaining = Input - Num1;
  const Num2 = await RandomInt(0, Remaining);
  Remaining = Input - (Num1 + Num2);
  const Num3 = await RandomInt(0, Remaining);
  Remaining = Input - (Num1 + Num2 + Num3);
  const Num4 = await RandomInt(0, Remaining);
  const Num5 = Input - (Num1 + Num2 + Num3 + Num4)


  return {
    Num1,
    Num2,
    Num3,
    Num4,
    Num5
  }
}

/**
 * Returns a random int between lower and upper, inclusive of both. - Not asynchronous.
 * If inputs are not ints, the result is not guaranteed to be an int nor is it guaranteed to be in the range.
 * The parameter lower may be the same as upper
 * @param {int} lower 
 * @param {int} upper 
 * @returns {int} - a random integer in the range lower to upper, inclusive of both
 */
function myRandInt(lower, upper) {
  return lower + Math.floor(Math.random()*(upper - lower + 1));
}

/** 
 * Randomly splits a total count into a number of groups with approximate equal probabilities. Parameter total must be an integer
 * greater than zero, while numGroups must be a integer >= 2, and should be at least three, since there are much more
 * efficient ways to randomly split an integer in two. If inputs are not ints, the result is not guaranteed 
 * to be an array of ints nor is it guaranteed that the sum of the elements of the array will be equal to total.
 * @param {int} total - the total to be split. Must be > 0
 * @param {int} numGroups - the number of groups in which to split. Must be at >= 2 and should be at least 3.
 * @returns {array} - an array of length numGroup, where the sum of the elements is equal to total.
 */
function split(total, numGroups)
{ 
  let remaining = total
  let arr = []
  for (let i = 0; i < numGroups;i++) {
    arr[i] = 0;
  }
  while (remaining >= numGroups) {
    const part = Math.floor(remaining/numGroups)
    for (let i = 0; i < numGroups; i++) {
      const share = myRandInt(0, part)
      arr[i] += share
      remaining -= share
    }
  }
  while (remaining > 0) {
    arr[myRandInt(0, numGroups-1)]++
    remaining--
  }
  return arr
}

module.exports = {
  RandomInt,
  SplitNumberInto2Rand,
  SplitNumberInto3Rand,
  SplitNumberInto5Rand,
  split
}