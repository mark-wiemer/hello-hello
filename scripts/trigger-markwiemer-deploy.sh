#!/usr/bin/env bash
set -euo pipefail

REPO="mark-wiemer/hello-hello"
WORKFLOW="markwiemer.com-deploy.yml"
REF="${1:-main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) is required. Install it from https://cli.github.com/." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh is not authenticated. Run: gh auth login" >&2
  exit 1
fi

echo "Triggering ${WORKFLOW} on ${REPO} (ref: ${REF})..."
gh workflow run "${WORKFLOW}" --repo "${REPO}" --ref "${REF}"

# Give GitHub a brief moment to index the new run before listing.
sleep 2

RUN_URL="$(gh run list \
  --repo "${REPO}" \
  --workflow "${WORKFLOW}" \
  --branch "${REF}" \
  --limit 1 \
  --json url \
  --jq '.[0].url')"

if [[ -n "${RUN_URL}" && "${RUN_URL}" != "null" ]]; then
  echo "Workflow run created: ${RUN_URL}"
  echo "Tip: tail logs with: gh run watch --repo ${REPO}"
else
  echo "Workflow dispatched. Open Actions to find the run:" >&2
  echo "https://github.com/${REPO}/actions/workflows/${WORKFLOW}" >&2
fi