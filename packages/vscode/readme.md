# Visual Studio Code

Commonly known as VS Code, this is the [most popular IDE](https://survey.stackoverflow.co/2025/technology/#1-dev-id-es) in the world!

## Setting up

There are two ways to use VS Code: local installation by downloading from [code.visualstudio.com](https://code.visualstudio.com) or in-browser editing via [vscode.dev](https://vscode.dev). For other cloud editors, see [Hello GitHub Codespaces](../github/codespaces/readme.md)

### Importing settings.json

This repo has a `settings.json` file that I use as my user settings. I create a symlink from this file to a new path that VS Code references in Linux Mint. This only works locally:

```bash
./link-settings.sh
```

## Managing

### Sorting settings.json

```bash
jq --sort-keys . settings.json > temp.json && mv temp.json settings.json
```

Note that this doesn't sort arrays, as order matters in some arrays.

## Troubleshooting

General steps for solving new issues

- Extension bisect: "Help: Start Extension Bisect"
- Settings
  - in the GUI, the `@modified` tag can help narrow down the issue
  - in the JSON, commenting out sections of the settings.json and manually bisecting can help identify the issue
- [New profile](https://code.visualstudio.com/docs/configure/profiles): try to reproduce the issue in a new VS Code profile

## Common issues

Exact steps for fixing issues I've had before

### package.json "dependencies" versions not appearing on hover

Expected behavior: When hovering over a dependency key in a package.json file, VS Code provides a hover:

![VS Code hover on package.json dependency key](hover-expected.png)

This goes away if you have a setting like `files.associations["*.json"] = "jsonc"`. Ensure the "\*.json" files are associated with the "json" language (default) and you should OK.
