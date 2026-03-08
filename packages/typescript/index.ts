// Node does not support `enum`
// (tested 22.22.1, 24.14.0, and 25.8.0)
// `tsx` package does :)
// use `pnpm start` to run this file
enum Color {
  Red = "r",
  Green = "g",
  Blue = "b",
}

console.log(Color.Red);
// Output: r
