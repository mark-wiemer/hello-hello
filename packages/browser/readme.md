# Browser

A sample browser extension with notes.

This extension copies the current page URL and title into a Markdown link on the
clipboard.

1. Navigate to any site, e.g. `example.com`
1. Click `Extensions` in the toolbar menu (puzzle piece near top-right)
1. Click `Markdown Link`
1. Open a text editor
1. Paste clipboard contents (Ctrl+V or right-click > paste)

You should see e.g. `[Example Domain](https://example.com/)`

This extension has only been tested in Firefox. It does not currently work in
Edge.

## Setup

This project uses [Deno](../notes/deno.md) instead of Node.js

- [Install Deno](https://deno.com)
- Ensure `firefox` Shell cmd launches Firefox (e.g. `sudo apt install firefox`)
- ```
  deno install
  deno run dev
  ```

## Resources

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension

- Installing via Firefox GUI doesn't work, it only loads the selected file, not
  all files in the folder
- Use `web-ext` and things work (`deno run dev`)

https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard
