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

function SplitNumberInto5Rand(Input) {  
  const Num1 = RandomInt(0, Input);
  const Remaining = Input - Num1;
  const Num2 = RandomInt(0, Remaining);
  const Remaining = Input - (Num1 + Num2);
  const Num3 = RandomInt(0, Remaining);
  const Remaining = Input - (Num1 + Num2 + Num3);
  const Num4 = RandomInt(0, Remaining);
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