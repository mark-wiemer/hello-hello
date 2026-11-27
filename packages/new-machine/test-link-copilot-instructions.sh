#!/bin/bash

set -e

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
link_script="$script_dir/link-copilot-instructions.sh"

if [[ ! -f "$link_script" ]]; then
    echo "FAIL: $link_script does not exist"
    exit 1
fi

test_home="$(mktemp -d)"
trap 'rm -rf "$test_home"' EXIT

mkdir -p "$test_home/.copilot"
printf 'existing instructions\n' > "$test_home/.copilot/copilot-instructions.md"

backup_count_before="$(find /tmp -maxdepth 1 -name 'copilot-instructions-backup-*' | wc -l)"

HOME="$test_home" bash "$link_script"

test_target="$test_home/.copilot/copilot-instructions.md"
test_source="$(cd "$script_dir" && pwd)/copilot-instructions.md"

if [[ ! -L "$test_target" ]]; then
    echo "FAIL: expected $test_target to be a symlink"
    exit 1
fi

if [[ "$(readlink "$test_target")" != "$test_source" ]]; then
    echo "FAIL: symlink points to $(readlink "$test_target"), expected $test_source"
    exit 1
fi

backup_count_after="$(find /tmp -maxdepth 1 -name 'copilot-instructions-backup-*' | wc -l)"

if [[ "$backup_count_after" -le "$backup_count_before" ]]; then
    echo "FAIL: expected existing instructions to be backed up"
    exit 1
fi

echo "PASS: Copilot instructions are linked and the existing file is backed up"
