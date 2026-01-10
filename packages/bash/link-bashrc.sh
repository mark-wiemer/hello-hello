#!/bin/bash

# todo de-dupe with vscode script
# todo support Windows?

verbose=0
for arg in "$@"; do
    case "$arg" in
        --verbose)
            verbose=1
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") [--verbose]"
            echo
            echo Creates a symlink from the .bashrc file here
            echo to the appropriate location on your machine.
            echo 
            echo Only for Linux Mint, not Windows or other
            echo Linux distros.
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

backup_and_remove_if_exists() {
    local target_path="$1"
    local backup_path

    if [ -f "$target_path" ] || [ -L "$target_path" ]; then
        # todo stop hardcoding this `bashrc` part
        backup_path="/tmp/bashrc-backup-$(date +%Y%m%d-%H%M%S).json"

        echo "Backing up existing settings to: $backup_path"
        run_cmd cp "$target_path" "$backup_path" 2>/dev/null || true
        echo "✓ Backup created"
        echo
        echo "Removing existing file at: $target_path"
        rm "$target_path"
        echo "✓ Removed"
    else
        echo "Checked $target_path"
        echo "No existing file found, skipping backup"
    fi
}

link_files() {
    local target_path
    local source_path
    local vscode_settings_win
    local repo_settings_win
    local ps_cmd
    
    # todo stop hardcoding this
    target_path="$HOME/.bashrc"

    # Path to settings.json in this monorepo
    source_path="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/settings.json"
    
    echo "Starting VS Code settings symlink setup..."
    echo "Target: $target_path"
    echo "Source: $source_path"
    echo
    
    backup_and_remove_if_exists "$target_path"
    
    # Create the symlink (platform-specific)
    echo "Creating symlink..."
    run_cmd ln -s "$source_path" "$target_path"
    
    if [ $? -eq 0 ]; then
        echo "✓ Symlink created successfully"
        echo
        echo "Verification:"
        ls -la "$target_path"
    else
        echo "✗ Failed to create symlink"
        return 1
    fi
}

link_files