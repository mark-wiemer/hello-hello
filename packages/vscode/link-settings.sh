#!/bin/bash

link_vscode_settings() {
    local os_type
    local vscode_settings
    local repo_settings
    local backup_path
    
    # Detect OS
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        os_type="windows"
        vscode_settings="$APPDATA/Code/User/settings.json"
        # Convert Windows path to POSIX-style (drive letter + forward slash)
        vscode_settings="${vscode_settings//\\//}"
    else
        os_type="linux"
        vscode_settings="$HOME/.config/Code/User/settings.json"
    fi
    
    # Path to settings.json in this monorepo
    repo_settings="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/settings.json"
    
    echo "Starting VS Code settings symlink setup..."
    echo "Detected OS: $os_type"
    echo "Target: $vscode_settings"
    echo "Source: $repo_settings"
    echo ""
    
    # Copy existing file to temp if it exists
    if [ -f "$vscode_settings" ] || [ -L "$vscode_settings" ]; then
        if [[ "$os_type" == "windows" ]]; then
            backup_path="$TEMP/vscode-settings-backup-$(date +%Y%m%d-%H%M%S).json"
        else
            backup_path="/tmp/vscode-settings-backup-$(date +%Y%m%d-%H%M%S).json"
        fi
        
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
    
    # Create the symlink (platform-specific)
    echo "Creating symlink..."
    
    if [[ "$os_type" == "windows" ]]; then
        # Windows: Use mklink via cmd.exe
        cmd.exe /c "mklink \"$vscode_settings\" \"$repo_settings\"" >/dev/null 2>&1
    else
        # Linux/Mac: Use ln -s
        ln -s "$repo_settings" "$vscode_settings"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✓ Symlink created successfully"
        echo ""
        echo "Verification:"
        if [[ "$os_type" == "windows" ]]; then
            dir "$vscode_settings" 2>/dev/null || ls -la "$vscode_settings"
        else
            ls -la "$vscode_settings"
        fi
    else
        echo "✗ Failed to create symlink"
        echo "Note: On Windows, you may need to run this script in an elevated terminal (Run as Administrator)"
        return 1
    fi
}

# Run the function
link_vscode_settings
