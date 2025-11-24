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

// As of writing, this branch is not protected, and returns 404
// https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2022-11-28
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

console.log(response);
