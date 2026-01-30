# Linux Mint

Linux Mint Cinnamon has been my main operating system since August 2025. It's very easy to get started with, I highly recommend it!

## Troubleshooting

- Disable secure boot in BIOS
- Check drivers, kernel, and other software
- Post in Discord

## Glossary

| Windows                  | Linux Mint                 |
| ------------------------ | -------------------------- |
| taskbar                  | panel                      |
| Start Menu               | home menu                  |
| Windows key, abbr. `Win` | Super key, abbr. `<Super>` |
| Shortcut                 | `.desktop` file            |

## Installing arbitrary software

`amd64.deb` files are best for my current machine, others may vary. I should probably learn what all the variations are all about, huh? [Microsoft Edge download](https://www.microsoft.com/en-us/edge/) seems to be pretty good at automatically choosing the right version for the current machine, probably copy whatever that installs.

## Clipboard history: Diodon

1. Install from Software Manager
1. Set custom keyboard shortcut to `/usr/bin/diodon`

(Parcellite is not used because it just doesn't paste into this file in GitHub + Firefox, for instance)

## Firefox

(I only use Firefox when working on RAM-intensive tasks like huge GitHub PRs)

1. Vertical tabs: `about:config` > `sidebar.verticalTabs` > `true`
2. Change default search engine
3. Firefox is probably up-to-date, but can only be updated via [Update Manager](https://forums.linuxmint.com/viewtopic.php?t=412975)
   > View current version at Menu > Help > About Firefox

## Cinnamenu

1. Install from Applets
2. Set to search with Bing
3. Disable sidebar
4. Right click panel > Panel settings > Panel edit mode > Drag Cinnamenu to the left, replacing Menu

## Flameshot (for screenshots, like Snipaste)

1. Install from Software Manager
2. Setup a keyboard shortcut that activates `flameshot gui` on `F7`
3. Use Ctrl+C to copy Flameshot selections :)

## FSearch (for file search, like Everything)

1. Install from Software Manager
2. To set it to scan everything, select Other Locations > This Computer

## Baobob Disk Usage Analyzer (like WinDirStat)

1. Install from https://flathub.org/apps/org.gnome.baobab

## Proton Pass

1. Install from https://proton.me/pass/download

## Godot

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

## rclone for OneDrive

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
