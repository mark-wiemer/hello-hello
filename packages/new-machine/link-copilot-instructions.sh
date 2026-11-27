#!/bin/bash

verbose=0
for arg in "$@"; do
    case "$arg" in
        --verbose)
            verbose=1
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") [--verbose]"
            echo
            echo "Creates a symlink from copilot-instructions.md here"
            echo "to ~/.copilot/copilot-instructions.md."
            exit 0
            ;;
    esac
done

run_cmd() {
    if [[ $verbose -eq 1 ]]; then
        "$@"
    else
        "$@" >/dev/null 2>&1
    fi
}

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source_path="$script_dir/copilot-instructions.md"
target_dir="$HOME/.copilot"
target_path="$target_dir/copilot-instructions.md"

echo "Starting Copilot instructions symlink setup..."
echo "Target: $target_path"
echo "Source: $source_path"
echo

mkdir -p "$target_dir"

if [ -f "$target_path" ] || [ -L "$target_path" ]; then
    backup_path="/tmp/copilot-instructions-backup-$(date +%Y%m%d-%H%M%S)"
    echo "Backing up existing instructions to: $backup_path"
    run_cmd cp "$target_path" "$backup_path" 2>/dev/null || true
    echo "Removing existing instructions..."
    rm "$target_path"
fi

echo "Creating symlink..."
run_cmd ln -s "$source_path" "$target_path"

if [ $? -eq 0 ]; then
    echo "Symlink created successfully"
    ls -la "$target_path"
else
    echo "Failed to create symlink"
    exit 1
fi
