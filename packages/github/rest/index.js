import { Octokit } from "@octokit/core";
import dotenv from "dotenv";

// Get secret config from untracked file, see `.env.sample` for guidance
dotenv.config({ path: "./.env.user" });

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const owner = "mark-wiemer";
const repo = "hello-hello";
const branch = "main";

//* Update repository settings
// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository
const repoResponse = await octokit.request(`PATCH /repos/${owner}/${repo}`, {
  owner: owner,
  repo: repo,
  has_wiki: false,
  has_discussions: true,
  has_projects: true,
  allow_merge_commit: false,
  squash_merge_commit_title: "PR_TITLE",
  allow_rebase_merge: false,
  allow_auto_merge: true,
  delete_branch_on_merge: true,
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

console.log(repoResponse);

//* Update branch protection
// https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2022-11-28#update-branch-protection
const branchResponse = await octokit.request(
  `PUT /repos/${owner}/${repo}/branches/${branch}/protection`,
  {
    owner: owner,
    repo: repo,
    branch: branch,
    required_status_checks: null,
    enforce_admins: true,
    required_pull_request_reviews: null,
    restrictions: null,
    required_linear_history: false,
    allow_force_pushes: false,
    allow_deletions: false,
    block_creations: false,
    required_conversation_resolution: true,
    lock_branch: false,
    allow_fork_syncing: true,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);

console.log(branchResponse);
