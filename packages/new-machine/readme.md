# Hello new machine

Setup steps for any new machine that I use

Most of this is already covered in the relevant package folders, like `git` and `vscode`.

## Linux Mint

Linux Mint Cinnamon has been my main operating system since August 2025. It's very easy to get started with, I highly recommend it!

### Glossary

| Windows                  | Linux Mint                 |
| ------------------------ | -------------------------- |
| taskbar                  | panel                      |
| Start Menu               | home menu                  |
| Windows key, abbr. `Win` | Super key, abbr. `<Super>` |
| Shortcut                 | `.desktop` file            |

### Installing arbitrary software

`amd64.deb` files are best for my current machine, others may vary. I should probably learn what all the variations are all about, huh? [Microsoft Edge download](https://www.microsoft.com/en-us/edge/) seems to be pretty good at automatically choosing the right version for the current machine, probably copy whatever that installs.

### Clipboard history: Diodon

1. Install from Software Manager
1. Set custom keyboard shortcut to `/usr/bin/diodon`

(Parcellite is not used because it just doesn't paste into this file in GitHub + Firefox, for instance)

### Firefox

(Honestly I only use Firefox when working on RAM-intensive tasks like huge GitHub PRs)

1. Vertical tabs: `about:config` > `sidebar.verticalTabs` > `true`
2. Change default search engine
3. Firefox is probably up-to-date, but can only be updated via [Update Manager](https://forums.linuxmint.com/viewtopic.php?t=412975)
   > View current version at Menu > Help > About Firefox

### Cinnamenu

1. Install from Applets
2. Set to search with Bing
3. Disable sidebar
4. Right click panel > Panel settings > Panel edit mode > Drag Cinnamenu to the left, replacing Menu

### Flameshot (for screenshots, like Snipaste)

1. Install from Software Manager
2. Setup a keyboard shortcut that activates `flameshot gui` on `F7`
3. Use Ctrl+C to copy Flameshot selections :)

### FSearch (for file search, like Everything)

1. Install from Software Manager
2. To set it to scan everything, select Other Locations > This Computer

### Baobob Disk Usage Analyzer (like WinDirStat)

1. Install from https://flathub.org/apps/org.gnome.baobab

### Proton Pass

1. Install from https://proton.me/pass/download

### Godot

1. Install from [godotengine.org](https://godotengine.org)
2. Extract
3. Double click within Files app to run as a sanity check
4. Create `.desktop` file for it
   ```ini
   [Desktop Entry]
   Encoding=UTF-8
   Version=1.0
   Type=Application
   Terminal=false
   Exec=/home/markw/my-stuff/apps/Godot_v4.3-stable_linux.x86_64
   Name=Godot 4.3
   Icon=/home/markw/my-stuff/apps/godot.svg
   ```
   > SVG from https://godotengine.org/assets/press/icon_color.svg, works fine without it, just nice QoL
5. Run from typing "Godot" in home menu as a sanity check

### rclone for OneDrive

1. `sudo apt install rclone`
2. `rclone config`
3. Go through the prompts
   - Use the drive with the simplest name (probably the only one that works)
   - Once the remote is setup, type `q` when prompted to quit config
4. `rclone ls onedrive:` to confirm the files are there :)
5. `rclone sync <source> <dest>` for a one-time sync:
   - remote into local:
     ```sh
     rclone sync onedrive: ./onedrive --verbose --exclude "Personal Vault/**"`
     ```
   - local into remote:
     ```sh
     rclone sync ./onedrive onedrive: --verbose
     ```

## Windows

### Windows Terminal

settings.json:

```json
{
  "$help": "https://aka.ms/terminal-documentation",
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "actions": [
    {
      "command": "find",
      "keys": "ctrl+shift+f"
    },
    {
      "command": {
        "action": "splitPane",
        "split": "auto",
        "splitMode": "duplicate"
      },
      "keys": "alt+shift+d"
    },
    {
      "command": "paste",
      "keys": "ctrl+v"
    },
    {
      "command": {
        "action": "copy",
        "singleLine": false
      },
      "keys": "ctrl+c"
    }
  ],
  "copyFormatting": "none",
  "copyOnSelect": false,
  "defaultProfile": "{5457c79a-36da-41a0-b1ba-b6ccbc729b2c}",
  "firstWindowPreference": "defaultProfile",
  "newTabMenu": [
    {
      "type": "remainingProfiles"
    }
  ],
  "profiles": {
    "defaults": {},
    "list": [
      {
        "commandline": "\"%PROGRAMFILES%\\git\\bin\\bash.exe\" --login -i -l",
        "elevate": false,
        "guid": "{5457c79a-36da-41a0-b1ba-b6ccbc729b2c}",
        "hidden": false,
        "icon": "C:\\Program Files\\Git\\mingw64\\share\\git\\git-for-windows.ico",
        "name": "Bash",
        "startingDirectory": "%USERPROFILE%"
      },
      {
        "guid": "{2c4de342-38b7-51cf-b940-2309a097f518}",
        "hidden": true,
        "name": "Ubuntu",
        "source": "Windows.Terminal.Wsl"
      },
      {
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "hidden": false,
        "name": "PowerShell",
        "source": "Windows.Terminal.PowershellCore"
      }
    ]
  },
  "schemes": [
    {
      "background": "#0C0C0C",
      "black": "#0C0C0C",
      "blue": "#0037DA",
      "brightBlack": "#767676",
      "brightBlue": "#3B78FF",
      "brightCyan": "#61D6D6",
      "brightGreen": "#16C60C",
      "brightPurple": "#B4009E",
      "brightRed": "#E74856",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#F9F1A5",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#CCCCCC",
      "green": "#13A10E",
      "name": "Campbell",
      "purple": "#881798",
      "red": "#C50F1F",
      "selectionBackground": "#FFFFFF",
      "white": "#CCCCCC",
      "yellow": "#C19C00"
    },
    {
      "background": "#012456",
      "black": "#0C0C0C",
      "blue": "#0037DA",
      "brightBlack": "#767676",
      "brightBlue": "#3B78FF",
      "brightCyan": "#61D6D6",
      "brightGreen": "#16C60C",
      "brightPurple": "#B4009E",
      "brightRed": "#E74856",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#F9F1A5",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#CCCCCC",
      "green": "#13A10E",
      "name": "Campbell Powershell",
      "purple": "#881798",
      "red": "#C50F1F",
      "selectionBackground": "#FFFFFF",
      "white": "#CCCCCC",
      "yellow": "#C19C00"
    },
    {
      "background": "#282C34",
      "black": "#282C34",
      "blue": "#61AFEF",
      "brightBlack": "#5A6374",
      "brightBlue": "#61AFEF",
      "brightCyan": "#56B6C2",
      "brightGreen": "#98C379",
      "brightPurple": "#C678DD",
      "brightRed": "#E06C75",
      "brightWhite": "#DCDFE4",
      "brightYellow": "#E5C07B",
      "cursorColor": "#FFFFFF",
      "cyan": "#56B6C2",
      "foreground": "#DCDFE4",
      "green": "#98C379",
      "name": "One Half Dark",
      "purple": "#C678DD",
      "red": "#E06C75",
      "selectionBackground": "#FFFFFF",
      "white": "#DCDFE4",
      "yellow": "#E5C07B"
    },
    {
      "background": "#FAFAFA",
      "black": "#383A42",
      "blue": "#0184BC",
      "brightBlack": "#4F525D",
      "brightBlue": "#61AFEF",
      "brightCyan": "#56B5C1",
      "brightGreen": "#98C379",
      "brightPurple": "#C577DD",
      "brightRed": "#DF6C75",
      "brightWhite": "#FFFFFF",
      "brightYellow": "#E4C07A",
      "cursorColor": "#4F525D",
      "cyan": "#0997B3",
      "foreground": "#383A42",
      "green": "#50A14F",
      "name": "One Half Light",
      "purple": "#A626A4",
      "red": "#E45649",
      "selectionBackground": "#FFFFFF",
      "white": "#FAFAFA",
      "yellow": "#C18301"
    },
    {
      "background": "#002B36",
      "black": "#002B36",
      "blue": "#268BD2",
      "brightBlack": "#073642",
      "brightBlue": "#839496",
      "brightCyan": "#93A1A1",
      "brightGreen": "#586E75",
      "brightPurple": "#6C71C4",
      "brightRed": "#CB4B16",
      "brightWhite": "#FDF6E3",
      "brightYellow": "#657B83",
      "cursorColor": "#FFFFFF",
      "cyan": "#2AA198",
      "foreground": "#839496",
      "green": "#859900",
      "name": "Solarized Dark",
      "purple": "#D33682",
      "red": "#DC322F",
      "selectionBackground": "#FFFFFF",
      "white": "#EEE8D5",
      "yellow": "#B58900"
    },
    {
      "background": "#FDF6E3",
      "black": "#002B36",
      "blue": "#268BD2",
      "brightBlack": "#073642",
      "brightBlue": "#839496",
      "brightCyan": "#93A1A1",
      "brightGreen": "#586E75",
      "brightPurple": "#6C71C4",
      "brightRed": "#CB4B16",
      "brightWhite": "#FDF6E3",
      "brightYellow": "#657B83",
      "cursorColor": "#002B36",
      "cyan": "#2AA198",
      "foreground": "#657B83",
      "green": "#859900",
      "name": "Solarized Light",
      "purple": "#D33682",
      "red": "#DC322F",
      "selectionBackground": "#FFFFFF",
      "white": "#EEE8D5",
      "yellow": "#B58900"
    },
    {
      "background": "#000000",
      "black": "#000000",
      "blue": "#3465A4",
      "brightBlack": "#555753",
      "brightBlue": "#729FCF",
      "brightCyan": "#34E2E2",
      "brightGreen": "#8AE234",
      "brightPurple": "#AD7FA8",
      "brightRed": "#EF2929",
      "brightWhite": "#EEEEEC",
      "brightYellow": "#FCE94F",
      "cursorColor": "#FFFFFF",
      "cyan": "#06989A",
      "foreground": "#D3D7CF",
      "green": "#4E9A06",
      "name": "Tango Dark",
      "purple": "#75507B",
      "red": "#CC0000",
      "selectionBackground": "#FFFFFF",
      "white": "#D3D7CF",
      "yellow": "#C4A000"
    },
    {
      "background": "#FFFFFF",
      "black": "#000000",
      "blue": "#3465A4",
      "brightBlack": "#555753",
      "brightBlue": "#729FCF",
      "brightCyan": "#34E2E2",
      "brightGreen": "#8AE234",
      "brightPurple": "#AD7FA8",
      "brightRed": "#EF2929",
      "brightWhite": "#EEEEEC",
      "brightYellow": "#FCE94F",
      "cursorColor": "#000000",
      "cyan": "#06989A",
      "foreground": "#555753",
      "green": "#4E9A06",
      "name": "Tango Light",
      "purple": "#75507B",
      "red": "#CC0000",
      "selectionBackground": "#FFFFFF",
      "white": "#D3D7CF",
      "yellow": "#C4A000"
    },
    {
      "background": "#300A24",
      "black": "#171421",
      "blue": "#0037DA",
      "brightBlack": "#767676",
      "brightBlue": "#08458F",
      "brightCyan": "#2C9FB3",
      "brightGreen": "#26A269",
      "brightPurple": "#A347BA",
      "brightRed": "#C01C28",
      "brightWhite": "#F2F2F2",
      "brightYellow": "#A2734C",
      "cursorColor": "#FFFFFF",
      "cyan": "#3A96DD",
      "foreground": "#FFFFFF",
      "green": "#26A269",
      "name": "Ubuntu-ColorScheme",
      "purple": "#881798",
      "red": "#C21A23",
      "selectionBackground": "#FFFFFF",
      "white": "#CCCCCC",
      "yellow": "#A2734C"
    },
    {
      "background": "#000000",
      "black": "#000000",
      "blue": "#000080",
      "brightBlack": "#808080",
      "brightBlue": "#0000FF",
      "brightCyan": "#00FFFF",
      "brightGreen": "#00FF00",
      "brightPurple": "#FF00FF",
      "brightRed": "#FF0000",
      "brightWhite": "#FFFFFF",
      "brightYellow": "#FFFF00",
      "cursorColor": "#FFFFFF",
      "cyan": "#008080",
      "foreground": "#C0C0C0",
      "green": "#008000",
      "name": "Vintage",
      "purple": "#800080",
      "red": "#800000",
      "selectionBackground": "#FFFFFF",
      "white": "#C0C0C0",
      "yellow": "#808000"
    }
  ],
  "themes": []
}
```

### Minimize animations

[MDN docs on prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences)

### Invert scroll Windows 11

Windows 11 24H2: Settings > "scroll direction"

Older:

1. Device Manager > Find device > Properties > Details > Device instance path > Copy value
2. Registry editor > HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Enum\HID > Go to path > Device Parameters > FlipFlopWheel = 1
3. Unplug device and plug it back in

4. Note that this only works for that device plugged into that port :/

### Upgrade AdBlock Plus

1. https://accounts.adblockplus.org/en/premium

### Snipaste

1. Update preferences:
   - Snip: F7
   - Snip and copy: Ctrl + F7
   - Custom snip: (unbound)
   - Paste: F8
   - Hide/Show all images: Ctrl + F8
   - Switch to another image group: (unbound)
   - Toggle mouse click-through: (unbound)

### Remove recycle bin desktop icon

Settings > Personalization > Themes > Desktop icon settings > uncheck "Recycle Bin"

### Disable Windows lock screen

Registry editor > Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows > New key > Personalization > New DWORD (32-bit) Value > NoLockScreen > NoLockScreen = 1

### Other programs

1. `winget install Git.Git vscodium voidtools.Everything snipaste devcom.lua fnm autohotkey.autohotkey golang.go optipng paint.net GitHub.cli`
1. Install WinDirStat (todo add to above `winget` command)
1. Install PowerToys (todo add to above `winget` command)

- Lua is preferred over LuaJIT as performance is not a high priority but ease of setup is. `luajit chess.lua` doesn't work out-of-the-box as of this writing, but `lua chess.lua` does.
