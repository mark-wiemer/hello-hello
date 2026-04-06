# Hello GitHub REST API (GHRA)

[GitHub REST API docs](https://docs.github.com/en/rest?apiVersion=2022-11-28) works via `curl` or `gh api`

- [Octokit core.js](https://github.com/octokit/core.js) is the official JS client for the REST API
  ```sh
  pnpm add @octokit/core
  ```

## Repository settings

- [REST API endpoint to update a repository](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository)

See `index.js` for a detailed example. Configures:

- Disable wikis
- Enable discussions
- Enable projects
- Block merge commits
- Set default commit message for squash merges to PR title
- Block rebase merging
- Allow auto-merge
- Automatically delete head branches

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
