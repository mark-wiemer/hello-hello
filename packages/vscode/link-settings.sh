#!/bin/bash

verbose=0
for arg in "$@"; do
    case "$arg" in
        --verbose)
            verbose=1
            ;;
        --help|-h)
            echo "Usage: $(basename "$0") [--verbose]"
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

is_windows_admin() {
    powershell.exe -NoProfile -NonInteractive -Command "if(([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { exit 0 } else { exit 1 }" >/dev/null 2>&1
}

backup_and_remove_if_exists() {
    local target_path="$1"
    local os_type="$2"
    local backup_path

    if [ -f "$target_path" ] || [ -L "$target_path" ]; then
        if [[ "$os_type" == "windows" ]]; then
            backup_path="$TEMP/vscode-settings-backup-$(date +%Y%m%d-%H%M%S).json"
        else
            backup_path="/tmp/vscode-settings-backup-$(date +%Y%m%d-%H%M%S).json"
        fi

        echo "Backing up existing settings to: $backup_path"
        cp "$target_path" "$backup_path" 2>/dev/null || true
        echo "✓ Backup created"

        echo "Removing existing file at: $target_path"
        rm "$target_path"
        echo "✓ Removed"
    else
        echo "No existing settings.json found, skipping backup"
    fi
}

link_vscode_settings() {
    local os_type
    local vscode_settings
    local repo_settings
    local vscode_settings_win
    local repo_settings_win
    local ps_cmd
    
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

    # On Windows, require an elevated shell. If not elevated, exit without making changes.
    if [[ "$os_type" == "windows" ]]; then
        if ! is_windows_admin; then
            echo "Sorry, this script only works in an elevated terminal"
            return 1
        fi
    fi
    
    # Path to settings.json in this monorepo
    repo_settings="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/settings.json"
    
    echo "Starting VS Code settings symlink setup..."
    echo "Detected OS: $os_type"
    echo "Target: $vscode_settings"
    echo "Source: $repo_settings"
    echo ""
    
    backup_and_remove_if_exists "$vscode_settings" "$os_type"
    
    # Create the symlink (platform-specific)
    echo "Creating symlink..."
    
    if [[ "$os_type" == "windows" ]]; then
    # Windows: Use PowerShell to create a symlink reliably (works well in VS Code integrated terminals)
    # Convert to native Windows paths for PowerShell
        vscode_settings_win="$(cygpath -w "$vscode_settings")"
        repo_settings_win="$(cygpath -w "$repo_settings")"

    # Windows PowerShell 5.1 note: New-Item supports -Path (not -LiteralPath).
    # Note: Creating symlinks may require elevated rights unless Developer Mode is enabled.
    # If SymbolicLink fails, fall back to Junction.
    ps_cmd="try { New-Item -ItemType SymbolicLink -Path '$vscode_settings_win' -Target '$repo_settings_win' -Force | Out-Null } catch { New-Item -ItemType Junction -Path '$vscode_settings_win' -Target '$repo_settings_win' -Force | Out-Null }"

    run_cmd powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ps_cmd"
    else
        # Linux/Mac: Use ln -s
    run_cmd ln -s "$repo_settings" "$vscode_settings"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✓ Symlink created successfully"
        echo ""
        echo "Verification:"
        if [[ "$os_type" == "windows" ]]; then
            # Use PowerShell for consistent output in Git Bash/MSYS
            powershell.exe -NoProfile -Command "Get-Item -Force -Path '$vscode_settings_win' | Format-List FullName,LinkType,Target"
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
