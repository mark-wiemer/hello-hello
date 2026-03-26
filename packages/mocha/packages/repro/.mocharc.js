console.log("mocha config");

export default {
  extension: ["ts", "tsx"],
  "node-option": ["import=tsx"],
  recursive: true,
  reporter: "spec",
  require: ["./test/setup.ts"],
  spec: ["src/**/*.test.ts"],
  timeout: 5000,
  "watch-files": ["src/**/*.ts", "test/**/*.ts"],
};
