#!/bin/bash
set -e

SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$ROOT_DIR"

MOD_PATH="$1"
VERSION="$2"

if [ -z "$MOD_PATH" ] || [ -z "$VERSION" ]; then
    echo "Usage: $0 <mod-path> <version>"
    echo "Example: $0 cleanup/menu 0.1.7"
    exit 1
fi

if [ ! -f "$MOD_PATH/changelog.md" ]; then
    echo "Error: No changelog.md found in '$MOD_PATH'"
    exit 1
fi

# Extract changelog for the specific version
# Replace dash bullets with star bullets for modiom
# mod.io only renders raw lines as unordered list items in some views
# sticking to traditional Markdown is best for now
CHANGELOG=$(awk -v ver="$VERSION" '
    /^## \[/ {
        if ($0 ~ "\\[" ver "\\]") {
            found=1
            next
        } else if (found) {
            exit
        }
    }
    found && /^[*-]/ {
        print
    }
' "$MOD_PATH/changelog.md" | sed 's/^\([ \t]*\)-/\1*/')

if [ -z "$CHANGELOG" ]; then
    echo "Error: No changelog found for version $VERSION in $MOD_PATH/changelog.md"
    exit 1
fi

ZIP_PATH=$("$SCRIPT_DIR/build-zip.sh" "$MOD_PATH")

modiom upload 2869 5641775 "$ZIP_PATH" --version "$VERSION" --changelog "$CHANGELOG"
