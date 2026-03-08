function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(numbers: number[]): number {
  return numbers.reduce((acc, num) => lcm(acc, num));
}

function isDivisible(dividend: number, divisors: number[]): boolean {
  const result = divisors.every((s) => {
    const remainder = Math.abs((dividend / s) % 1);
    const epsilon = 0.001;
    const res = remainder <= 0.001 || remainder >= 1 - epsilon;
    // console.log(`Math.abs((${dividend} / ${s}) % 1) <= 0.001 ===`, res);
    // console.log(`remainder: `, remainder);
    return res;
  });

  for (const divisor of divisors) {
    console.log(`${dividend} / ${divisor} =`, dividend / divisor);
  }

  return result;
}

const zoomLevels = [1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
const intZoomLevels = [11, 125, 15, 175, 2, 25, 3, 4, 5];
const zoomLcm = lcmArray(intZoomLevels);

const result = isDivisible(165, zoomLevels);
console.log(result);
