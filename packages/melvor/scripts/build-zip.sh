#!/bin/bash
set -e

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$ROOT_DIR"

MOD_PATH="$1"

if [ -z "$MOD_PATH" ]; then
    echo "Usage: $0 <mod-path>"
    echo "Example: $0 cleanup/menu"
    exit 1
fi

if [ ! -d "$MOD_PATH" ]; then
    echo "Error: Mod directory '$MOD_PATH' not found"
    exit 1
fi

MOD_NAME=$(echo "$MOD_PATH" | tr '/' '-')
ZIP_PATH="dist/${MOD_NAME}.zip"

mkdir -p dist
rm -f "$ZIP_PATH"
(cd "$MOD_PATH" && zip -r "../../$ZIP_PATH" .)

echo "$ZIP_PATH"
