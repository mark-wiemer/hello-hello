// Node 22.21.1 does not support `enum`
// `tsx` package does :)
// use `npm start` to run this file
enum Color {
  Red = "r",
  Green = "g",
  Blue = "b",
}

console.log(Color.Red);
// Output: r
