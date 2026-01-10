# Hello Git

[How to ignore new changes to a tracked file with git](https://stackoverflow.com/questions/23673174/how-to-ignore-new-changes-to-a-tracked-file-with-git)

```sh
git update-index --assume-unchanged <filename>
```

```sh
git update-index --no-assume-unchanged <filename>
```

## Git LFS

For tracking images and other binary/non-text files, see [Git LFS](https://git-lfs.com/).

This command prints objects to commit and should include `(LFS)` to reference the files Git LFS is tracking vs `(Git)` for files that Git (core) is tracking but Git LFS is not tracking.

```sh
git lfs status
```

## Submodules

After first clone of repo:

```sh
git submodule update --init --recursive
```

Update all to match current remote:

```sh
git submodule update --remote
```
