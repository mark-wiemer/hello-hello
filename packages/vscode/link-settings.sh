#!/bin/bash

link_vscode_settings() {
    # Path to VS Code user settings on Linux
    local vscode_settings="$HOME/.config/Code/User/settings.json"
    
    # Path to settings.json in this monorepo
    local repo_settings="/home/markw/my-stuff/hello-hello/packages/vscode/settings.json"
    
    echo "Starting VS Code settings symlink setup..."
    echo "Target: $vscode_settings"
    echo "Source: $repo_settings"
    echo ""
    
    # Copy existing file to temp if it exists
    if [ -f "$vscode_settings" ] || [ -L "$vscode_settings" ]; then
        local backup_path="/tmp/vscode-settings-backup-$(date +%Y%m%d-%H%M%S).json"
        echo "Backing up existing settings to: $backup_path"
        cp "$vscode_settings" "$backup_path" 2>/dev/null || true
        echo "✓ Backup created"
        
        # Delete the existing file/symlink
        echo "Removing existing file at: $vscode_settings"
        rm "$vscode_settings"
        echo "✓ Removed"
    else
        echo "No existing settings.json found, skipping backup"
    fi
    
    # Create the symlink
    echo "Creating symlink..."
    ln -s "$repo_settings" "$vscode_settings"
    
    if [ $? -eq 0 ]; then
        echo "✓ Symlink created successfully"
        echo ""
        echo "Verification:"
        ls -la "$vscode_settings"
    else
        echo "✗ Failed to create symlink"
        return 1
    fi
}

# Run the function
link_vscode_settings
