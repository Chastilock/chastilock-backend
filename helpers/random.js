function RandomInt(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}

function SplitNumberInto2Rand(Input) {  
  const Num1 = RandomInt(0, Input);
  const Num2 = Input - Num1;

  return {
    Num1,
    Num2
  }
}

function SplitNumberInto3Rand(Input) {  
  const Num1 = RandomInt(0, Input);
  const Remaining = Input - Num1;
  const Num2 = RandomInt(0, Remaining);
  const Num3 = Input - (Num1 + Num2)

  return {
    Num1,
    Num2,
    Num3
  }
}

module.exports = {
  RandomInt,
  SplitNumberInto2Rand,
  SplitNumberInto3Rand
}