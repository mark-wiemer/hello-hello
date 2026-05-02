# Releasing a custom version of Mocha

Some behaviors cannot be reliably reproduced using local checkouts of Mocha. Additionally, reproducing behaviors with a registry-installed version of Mocha is the most reliable way to mimic end-user experience.

## How to release

### Setup

1. Fork Mocha on GitHub
1. Clone your fork
1. Checkout a new branch and set its remote tracking branch to one associated with your fork
1. Make your changes

### Releasing

1. Change `name` in `package.json` to e.g. `"name": "@mark-wiemer/mocha"`
1. Run the "Release Please" GitHub workflow against your branch, with your branch name set in both fields

<!-- todo more! -->
