# Hello new machine

Setup steps for any new machine that I use

Most of this is already covered in the relevant package folders, like `git` and `vscode`.

## Upgrade AdBlock Plus

1. https://accounts.adblockplus.org/en/premium

## Link global Copilot instructions

Run the setup script from this directory:

```bash
chmod +x ./link-copilot-instructions.sh
./link-copilot-instructions.sh
```

The script backs up any existing `~/.copilot/copilot-instructions.md` file,
then replaces it with a symlink to
[`copilot-instructions.md`](./copilot-instructions.md).
