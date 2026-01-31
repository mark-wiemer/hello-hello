# Rebranding Modrinth

Ref https://github.com/mark-wiemer/nerds-minecraft-launcher/issues/1

https://github.com/modrinth/code/blob/main/COPYING.md is very clear:

> The use of Modrinth branding elements, including but not limited to the wrench-in-labyrinth logo, the landing image, and any variations thereof, is strictly prohibited without explicit written permission from Rinth, Inc. This includes trademarks, logos, or other branding elements.

As such, I need to genuinely rebrand this repo before actively sharing it. As much as I would love to call it Markrinth, I legally need a name that reasonable people wouldn't associate with Rinth, Inc. I love Noto Font's nerd face emoji, so I'll be calling this Nerd's Minecraft Launcher, or NML, and all Modrinth icons will be replaced with the nerd emoji.

## All reviewed files

Before sharing, I need to review every single file in `./code`:

- .cargo: good
- .github: rebranded
-

### Final checks

- [ ] Ctrl+F "modrinth"
- [ ] find and manually preview all image files
  - [ ] png
  - [ ] ico (not just immediate top layer but all bundled layers)
  - [ ] jpg
  - [ ] others? list all file extensions and go from there
