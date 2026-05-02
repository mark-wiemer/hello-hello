# Releasing a custom version of Mocha

Some behaviors cannot be reliably reproduced using local checkouts of Mocha. Additionally, reproducing behaviors with a registry-installed version of Mocha is the most reliable way to mimic end-user experience.

## How to release

### Setup

1. Fork mochajs/mocha on GitHub
1. Clone your fork onto your local machine
1. Copy tags from upstream (mochajs) to origin (you), e.g.:

   ```sh
   git fetch upstream 'refs/tags/v12*:refs/tags/v12*' && git push origin 'refs/tags/v12*' --force
   ```

1. Checkout a new branch and set its remote tracking branch to one associated with your fork
1. Change metadata (readme, name, URL in package.json, etc) to your info and scope to avoid confusion
1. Make your changes

### Releasing

1. Ensure `name` in `package.json` is scoped correctly, e.g. `"name": "@mark-wiemer/mocha"`
1. Commit your changes
1. Run the "Release Please" GitHub workflow against your branch, with your branch name set in both fields

<!-- todo more! -->
