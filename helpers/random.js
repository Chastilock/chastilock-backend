const randomNumber = require("random-number-csprng")
async function RandomInt(min, max) {  
    return await randomNumber(min, max);
}

async function SplitNumberInto2Rand(Input) {  
  const Num1 = await RandomInt(0, Input);
  const Num2 = Input - Num1;

  return {
    Num1,
    Num2
  }
}

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

module.exports = {
  RandomInt,
  SplitNumberInto2Rand,
  SplitNumberInto3Rand,
  SplitNumberInto5Rand
}