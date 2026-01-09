# Hello React

(Formerly Hello Vite or hello-vite)

A batteries-included template project for React, Vite, and TypeScript using all my favorite tools. Also includes my favorite `package.json` npm scripts :) Meant for complex interactive websites.

Tools, in alphabetical order:

- [ESLint](https://eslint.org)
- [Playwright](https://playwright.dev)
- [Prettier](https://prettier.io)
- [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro)
- [React](https://react.dev)
- [sort-package-json](https://github.com/keithamus/sort-package-json)
- [TypeScript](https://typescriptlang.org)
- [Vite](https://vite.dev)
- [Vitest](https://vitest.dev)

---

## Project overview

Man, building for the web is hard. This is a trivial interactive webpage, and could be made in just a few lines of vanilla JavaScript. However, it's meant to represent something that could easily turn into an extremely complex webpage without adding additional core tools. For simpler pages (and newer devs), I recommend trying vanilla JavaScript, HTML, and CSS to understand the basics. Then, once you find yourself needing to render complex dynamic data tables, search bars, or other common interactive elements, use React to hook into the rich ecosystem of components available. React is never necessary, but often valuable.

The functional tools of this project:

| Tool       | Purpose                                                            |
| ---------- | ------------------------------------------------------------------ |
| React      | High-level web framework for creating complex interactive webpages |
| TypeScript | Preferred programming language for maintainable React code         |
| Vite       | Compiler turning React source code into minified JavaScript        |

(All tables are alphabetical by leftmost column)

Since we're finding ourselves dealing with a site as complex as a React app, we should automate a lot of checks to make sure things are going smoothly:

- Code linting: "During the day, does it give me a headache?" Very subjective!
- Functional tests: "At the end of the day, does it work?" Also subjective!

| Check            | Tool                  | Tool Purpose                                         |
| ---------------- | --------------------- | ---------------------------------------------------- |
| Code linting     | ESLint                | Detects code quality and potential functional issues |
| Code linting     | Prettier              | Formats code                                         |
| Code linting     | sort-package-json     | Orders keys in `package.json`                        |
| Functional tests | Playwright            | Runs end-to-end tests                                |
| Functional tests | React Testing Library | Facilitates integration testing of React components  |
| Functional tests | Vitest                | Executes unit tests and integration tests            |

### package.json dependencies

`package.json` lists a lot of dependencies, and their purposes aren't immediately clear. Most of them are peer dependencies, which I admit is a bit of a weak point for me:

| Dependency                  | Tool              | Description                                              |
| --------------------------- | ----------------- | -------------------------------------------------------- |
| @eslint/js                  | ESLint            | Recommended ESLint config for any project                |
| @playwright/test            | Playwright        | Testing library, the only part of Playwright we need     |
| @testing-library/jest-dom   | RTL               | RTL Jest matchers                                        |
| @testing-library/react      | RTL               | This **is** RTL                                          |
| @testing-library/user-event | RTL               | Simulate user interaction with RTL                       |
| @types/react                | TypeScript        | Write a React app using TypeScript types                 |
| @types/react-dom            | TypeScript        | Write a React app using TypeScript types                 |
| @vitejs/plugin-react        | Vite              | Compile a React app                                      |
| eslint                      | ESLint            | This **is** ESLint                                       |
| jsdom                       | RTL               | Emulate the environment in which the resulting code runs |
| prettier                    | Prettier          | This **is** Prettier                                     |
| sort-package-json           | sort-package-json | This **is** sort-package-json                            |
| start-server-and-test       | Playwright        | Orchestrates hosting then testing the final React app    |
| typescript                  | TypeScript        | This **is** TypeScript                                   |
| typescript-eslint           | TypeScript        | Recommended ESLint config for any TypeScript project     |
| vite                        | Vite              | This **is** Vite                                         |
| vitest                      | Vitest            | This **is** Vitest                                       |

## To-do

- Replace `.prettierrc` with the "prettier" prop in package.json
- Switch to pnpm
- Accessibility testing with [axe DevTools](https://www.deque.com/axe/devtools/)
- Integration with [Bingo](https://create.bingo)?
- GitHub CLI for GitHub repo settings
- More docs on npm scripts, GH workflows, and GH Pages
- Integrate automation into a GH PR workflow
