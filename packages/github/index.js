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

//* Update branch protection
// https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2022-11-28#update-branch-protection
const response = await octokit.request(
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

console.log(response);
