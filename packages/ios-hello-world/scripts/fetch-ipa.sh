#!/usr/bin/env bash
# Trigger/await the iOS Hello World CI build and download the unsigned .ipa locally.
#
# Replaces clicking through the GitHub Actions web UI. Uses the GitHub CLI (gh) to find
# the workflow run for your current commit, wait for it to finish, and download + unzip
# HelloWorld.ipa into <package>/build/ipa/.
#
# Normal flow: push your commit (the push triggers the build), then run this script.
# Use --dispatch to trigger a fresh run without a new commit (requires the workflow to
# exist on the repo's default branch).
#
# Usage:
#   bash scripts/fetch-ipa.sh [--dispatch] [--out-dir DIR]

set -euo pipefail

workflow="ios-hello-world-build.yml"
artifact="HelloWorld-ipa"
dispatch=0
out_dir=""

# Resolve paths relative to this script so it works from any working directory.
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
package_root="$(dirname "$script_dir")"

while [ $# -gt 0 ]; do
  case "$1" in
    --dispatch) dispatch=1; shift ;;
    --out-dir) out_dir="${2:?--out-dir needs a value}"; shift 2 ;;
    -h|--help) sed -n 's/^# \{0,1\}//p' "$0"; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

[ -n "$out_dir" ] || out_dir="$package_root/build/ipa"

# --- Preflight ---------------------------------------------------------------
command -v gh >/dev/null 2>&1 || {
  echo "GitHub CLI 'gh' not found. Install from https://cli.github.com then run 'gh auth login'." >&2
  exit 1
}
gh auth status >/dev/null 2>&1 || {
  echo "Not logged in to GitHub CLI. Run: gh auth login" >&2
  exit 1
}

branch="$(git rev-parse --abbrev-ref HEAD)"
sha="$(git rev-parse HEAD)"
echo "Branch: $branch   Commit: ${sha:0:7}"

# --- Optionally trigger a fresh run -----------------------------------------
if [ "$dispatch" -eq 1 ]; then
  echo "Dispatching '$workflow' on '$branch'..."
  gh workflow run "$workflow" --ref "$branch" || {
    echo "workflow_dispatch failed. It requires the workflow on the default branch." >&2
    echo "Either merge the workflow to the default branch, or just 'git push' and re-run without --dispatch." >&2
    exit 1
  }
fi

# --- Find the run for this exact commit (poll ~90s; covers a just-pushed commit) ---
echo "Looking for a workflow run for commit ${sha:0:7}..."
jq_filter="[.[] | select(.headSha == \"$sha\")] | sort_by(.databaseId) | last | .databaseId // empty"
run_id=""
for _ in $(seq 1 30); do
  run_id="$(gh run list --workflow "$workflow" --branch "$branch" --limit 30 \
    --json databaseId,headSha,status --jq "$jq_filter")"
  [ -n "$run_id" ] && break
  sleep 3
done
if [ -z "$run_id" ]; then
  echo "No workflow run found for commit ${sha:0:7} on '$branch'." >&2
  echo "Push the commit first (git push), or pass --dispatch to trigger one." >&2
  exit 1
fi
echo "Found run #$run_id"

# --- Wait for completion (non-zero exit if the build fails) ------------------
gh run watch "$run_id" --exit-status || {
  echo "Build run #$run_id did not succeed. Inspect: gh run view $run_id --log-failed" >&2
  exit 1
}

# --- Download + unzip the artifact ------------------------------------------
mkdir -p "$out_dir"
gh run download "$run_id" --name "$artifact" --dir "$out_dir"

ipa="$(find "$out_dir" -name 'HelloWorld.ipa' -type f | head -n 1)"
if [ -z "$ipa" ]; then
  echo "Artifact downloaded but no HelloWorld.ipa found under $out_dir." >&2
  exit 1
fi

echo ""
echo "IPA ready: $ipa"
