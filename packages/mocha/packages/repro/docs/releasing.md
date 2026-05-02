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
1. Commit these changes following Angular conventions (e.g. `chore: update metadata`)
1. Change the baseline in `manifest.json` to e.g. `12.0.0-beta-9.4.issue-5899.0`
1. Create and push a tag for the new baseline:
   ```sh
   git tag v12.0.0-beta-9.4.issue-5899.0
   git push --tags
   ```
1. Make your changes
1. Commit your changes

### Releasing

1. Ensure `name` in `package.json` is scoped correctly, e.g. `"name": "@mark-wiemer/mocha"`
1. Run the "Release Please" GitHub workflow against your branch, with your branch name set in both fields
1. Merge the "Release Please" PR
1. Trigger the "Release Please" GitHub workflow gain on the same branch, just as before.
