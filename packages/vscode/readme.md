# Visual Studio Code

Commonly known as VS Code, this is the [most popular IDE](https://survey.stackoverflow.co/2025/technology/#1-dev-id-es) in the world!

## Setting up

### Importing settings.json

This repo has a `settings.json` file that I use as my user settings. I create a symlink from this file to a new path that VS Code references in Linux Mint:

## Troubleshooting

General steps for solving new issues

- Extension bisect: "Help: Start Extension Bisect"
- Settings: the `@modified` tag can help narrow down the issue
- [New profile](https://code.visualstudio.com/docs/configure/profiles): try to reproduce the issue in a new VS Code profile

## Common issues

Exact steps for fixing issues I've had before

### package.json "dependencies" versions not appearing on hover

Expected behavior: When hovering over a dependency key in a package.json file, VS Code provides a hover, like it does here for me in a vanilla installation of VS Code:

![VS Code hover on package.json dependency key](hover-expected.png)

However, this just isn't working for me despite a lot of troubleshooting!

- New profile: cannot reproduce in new blank profile!
- Extension bisect: I returned to my default profile. After disabling all installed extensions (not builtin ones), I can still reproduce the issue. I re-enabled all my extensions after this to maintain a control.
- Settings: Commenting out my user settings.json results in me no longer being able to repro the issue!
  - `files.associations["*.json"] = "jsonc"` causes this whole shebang not to work
    - all because I wanted comments in my package.json files!
