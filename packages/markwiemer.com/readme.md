# [markwiemer.com](https://markwiemer.com)

My personal site hosting my articles, pictures of my dog, and other stuff I like 😊 For change history earlier than 2026-01-03, see [archived markwiemer.com GitHub repo](https://github.com/mark-wiemer/markwiemer.com)

## Running locally

Pre-requisites:

- [Node.js](../javascript/readme.md)
- [pnpm](../pnpm/readme.md)

Setup:

```sh
pnpm i
pnpm dev
```

## Notes

Hosting tools:

- [GitHub Pages](../github/pages/readme.md)
- [Namecheap](https://www.namecheap.com/)

Developer tools:

- [Astro](../astro/readme.md) to build the site
- [Git LFS](../git/readme.md) to better track changes to images
- [GitHub Actions](../github/readme.md) to automatically deploy the site
- [Node.js](../javascript/readme.md) to run JavaScript
- [pnpm](../pnpm/readme.md) to manage packages
- [Prettier](https://prettier.io) to format the repo

Resources:

- [Emojipedia](https://emojipedia.org/): Source for high-res transparent-background emojis (double-check that you can re-use them!)
- [Favicon Converter](https://favicon.io/favicon-converter/): don't send copyrighted stuff here without investigating!

Console logs:

- I use `console.debug` to keep things clean unless folks are really digging in!
- Edge reports some logs even though I don't want it to:
  - ```
    [Intervention] Images loaded lazily and replaced with placeholders. Load events are deferred. See https://go.microsoft.com/fwlink/?linkid=2048113
    ```

    - Any site that has `img[loading="lazy"]` will have this
  - ```
    Navigated to https://markwiemer.com
    ```

    - Edge just does this for every site
