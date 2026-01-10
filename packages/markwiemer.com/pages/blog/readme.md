# Blog

- Articles are written in Markdown + HTML
- Template is written in HTML, putting article content in a div
- Build output is formatted for inspection, but not committed, as it's procedurally generated

## Hardlinks

Some Markdown files here are hardlinked to my Obsidian vault for ergonomic editing:

```sh
ln /path/to/original /path/to/hardlink
```

For example:

```sh
ln "/home/markw/my-stuff/obsidian/News/2026-01-07 Killing of Renee Good.md" "./2026-01-07 killing-renee-good.md"
```

However, saving the file in VS Code breaks the hardlink and I don't know a workaround. So instead, use `prettier --write .` to format the file as needed. Then close and re-open the file in Obsidian to get the latest changes.

To check if two files are hardlinked:

```sh
ls -li "/home/markw/my-stuff/obsidian/News/2026-01-07 Killing of Renee Good.md" "./2026-01-07 killing-renee-good.md"
```
