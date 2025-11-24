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

Only available via REST. See `index.js` for a detailed example.

```js
const response = await octokit.request(
  `GET /repos/${owner}/${repo}/branches/${branch}/protection`,
  {
    owner: owner,
    repo: repo,
    branch: branch,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);
```

## Actions

[GitHub Actions](https://docs.github.com/en/actions) is the service that runs workflows.
Workflows are defined in workflow files.
Workflow files must be in `/.github/workflows`, no subfolders allowed.

- [stale.yml](/.github/workflows/stale.yml) handles stale issues and PRs. Ref PR #1, #2, and issue #3 for examples.
