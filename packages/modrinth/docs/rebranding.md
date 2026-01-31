# Rebranding Modrinth

Ref https://github.com/mark-wiemer/nerds-minecraft-launcher/issues/1

https://github.com/modrinth/code/blob/main/COPYING.md is very clear:

> The use of Modrinth branding elements, including but not limited to the wrench-in-labyrinth logo, the landing image, and any variations thereof, is strictly prohibited without explicit written permission from Rinth, Inc. This includes trademarks, logos, or other branding elements.

As such, I need to genuinely rebrand this repo before actively sharing it. As much as I would love to call it Markrinth, I legally need a name that reasonable people wouldn't associate with Rinth, Inc. I love Noto Font's nerd face emoji, so I'll be calling this Nerd's Minecraft Launcher, or NML, and all Modrinth icons will be replaced with the nerd emoji.

## All reviewed files

Before sharing, I need to review every single file in `./code/apps/app` and make sure it complies with Modrinth's rules (or isn't part of the core app):

- .cargo: good
- .github: rebranded
- .idea: good
- .vscode: good
- apps
  - app
    - capabilities: removed ads
    - icons: rebranded. `icns` file (macOS) removed
    - nsis: good
    - src
      - api: skimmed, doesn't seem to have Modrinth branding
      - macos: skipped, we're only building for Linux
      - (other files): skimmed, doesn't seem to have Modrinth branding
    - Cargo.toml: rebranded
    - packge.json: rebranded
    - README.md: rebranded
    - tauri.\*.conf.json: branded
  - (all other folders in `apps` were skipped as they're not part of the core app)

### Final checks

- [x] Ctrl+F "modrinth"
- [x] find and manually preview all image files
  - [x] png
  - [x] ico (not just immediate top layer but all bundled layers)
  - [x] others? list all file extensions and go from there
    - ```sh
      git ls-files | grep -oE '\.[^./]+$' | sort -u
      ```
    - ```sh
      git ls-files '*.ico' '*.png' '*.kra' '*.svg' '*.webp'
      ```
    - Everything reviewed and rebranded accordingly
- [x] use `example.com` in place of `modrinth.com` where necessary
- [x] splash screen
- [x] remove Modrinth sign in
  - [x] bottom left
  - [x] friend list (removed all friends logic)

### Other modules

I'm not going to rebrand everything all at once. Below are non-core modules that should be rebranded before sharing, but are not part of the core NML app:

- todo
