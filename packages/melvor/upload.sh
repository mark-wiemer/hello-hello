#!/bin/bash
set -e

MOD_PATH="$1"
VERSION="$2"

if [ -z "$MOD_PATH" ] || [ -z "$VERSION" ]; then
    echo "Usage: $0 <mod-path> <version>"
    echo "Example: $0 cleanup/menu 0.1.7"
    exit 1
fi

if [ ! -d "$MOD_PATH" ]; then
    echo "Error: Mod directory '$MOD_PATH' not found"
    exit 1
fi

if [ ! -f "$MOD_PATH/changelog.md" ]; then
    echo "Error: No changelog.md found in '$MOD_PATH'"
    exit 1
fi

# Extract mod name from path (e.g., cleanup/menu -> cleanup-menu)
MOD_NAME=$(echo "$MOD_PATH" | tr '/' '-')

# Extract changelog for the specific version
# Replace dash bullet points with asterisk bullet points as modiom workaround
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
' "$MOD_PATH/changelog.md" | sed 's/^- /* /')

if [ -z "$CHANGELOG" ]; then
    echo "Error: No changelog found for version $VERSION in $MOD_PATH/changelog.md"
    exit 1
fi

# Build the zip
ZIP_PATH="dist/${MOD_NAME}.zip"
rm -f "$ZIP_PATH"
(cd "$MOD_PATH" && zip -r "../../$ZIP_PATH" .)

# Upload to mod.io
modiom upload 2869 5641775 "$ZIP_PATH" --version "$VERSION" --changelog "$CHANGELOG"
