# Hello TypeScript

I've been writing TypeScript since like 2018 but a lot has changed since then!

## Running TypeScript files

Back in the day, we needed `tsconfig.json` and `tsc` (or `esbuild`) to transform TS to JS,
then Node would execute the JS.
Now we have type-stripping in Node so we can use `node index.ts` on simple TS files,
but Node doesn't support `enum` syntax as of writing.
The `tsx` package (not to be confused with the TSX language) seems to be a great option for small TS projects :)
As of writing, `tsx` uses `esbuild` behind the scenes, and `tsconfig.json` is optional.

```ts
// index.ts
enum Color {
  Red = "r",
  Green = "g",
  Blue = "b",
}

console.log(Color.Red);
// Output: r
```

```sh
$ npx tsx index.ts
r
```
