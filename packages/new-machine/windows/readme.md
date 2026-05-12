# New machine: Windows

Programs and settings specific to Windows

## Windows Terminal

See `terminal.settings.json`

## Minimize animations

[MDN docs on prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences)

## Invert scroll Windows 11

Windows 11 24H2: Settings > "scroll direction"

Older:

1. Device Manager > Find device > Properties > Details > Device instance path > Copy value
2. Registry editor > HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\HID > Go to path > Device Parameters > FlipFlopWheel = 1
3. Unplug device and plug it back in
4. Note that this only works for that device plugged into that port :/

## Upgrade AdBlock Plus

1. https://accounts.adblockplus.org/en/premium

## Snipaste

1. Update preferences:
   - Snip: F7
   - Snip and copy: Ctrl + F7
   - Custom snip: (unbound)
   - Paste: F8
   - Hide/Show all images: Ctrl + F8
   - Switch to another image group: (unbound)
   - Toggle mouse click-through: (unbound)

## Remove recycle bin desktop icon

Settings > Personalization > Themes > Desktop icon settings > uncheck "Recycle Bin"

## Disable Windows lock screen

Registry editor > Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows > New key > Personalization > New DWORD (32-bit) Value > NoLockScreen > NoLockScreen = 1

## PowerToys

Use PowerToys Win+Space instead of the Start menu as it seems the Start menu is officially permabloated.

## Long filenames

```powershell
# PowerShell (any version)
reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem `
 /v LongPathsEnabled /t REG_DWORD /d 1 /f
```

```sh
git config --global core.longpaths true
```

<!-- other parts of the repo link to this section, do not move without providing new link -->

## Visual Studio

[Visual Studio](https://visualstudio.microsoft.com/) is a closed-source Windows-only IDE originally built for .NET, but now has plugins for many languages.

- Use Visual Studio Community 2026 (not Insiders)
- Sign in with your GitHub account
- Use Unix (LF) line endings
- All Settings > Environment > Keyboard > ... mapping scheme > Visual Studio Code

See the sibling `.vssettings` file for all settings. We can import this file following Tools > Import and Export Settings. There are a couple errors when doing this but it mostly works.

Some important settings might not get updated:

- The default code cleanup profile should include all fixers (Configure Code Cleanup)

### Todo

- Better Comments
- Keyboard shortcuts
  - To import/export
  - Misc VS Code custom shortcuts
    - `Ctrl+K, W` should close all tabs, not `Ctrl+K, Ctrl+W`
- Settings
  - Where to look for and save new projects or solutions
- CSharpier?

## Other programs

1. `winget install Git.Git vscodium voidtools.Everything snipaste devcom.lua fnm autohotkey.autohotkey golang.go optipng paint.net GitHub.cli`
1. Install WinDirStat (todo add to above `winget` command)

- Lua is preferred over LuaJIT as performance is not a high priority but ease of setup is. `luajit chess.lua` doesn't work out-of-the-box as of this writing, but `lua chess.lua` does.
