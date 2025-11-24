# Hello GitHub

[GitHub docs homepage](https://docs.github.com/en)

Interesting subpages:

- [GitHub Apps docs](https://docs.github.com/en/apps): OK I had never heard of this one
- [GitHub CLI docs](https://docs.github.com/en/github-cli) has a great quickstart
- [GitHub REST API docs](https://docs.github.com/en/rest?apiVersion=2022-11-28) works via `curl` or `gh api`
  - [Octokit core.js](https://github.com/octokit/core.js) is the official JS client for the REST API
    ```sh
    pnpm add @octokit/core
    ```

## Branch protection

- [REST API endpoints for protected branches](https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2022-11-28)

Only available via API:

```sh
gh api \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/OWNER/REPO/branches/BRANCH/protection
```
