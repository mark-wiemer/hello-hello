# Hello Counter — Godot 4 C# (build on Windows, install on iOS later)

A minimal Godot 4 game with a counter button, written in C#.
Run and develop on Windows; export to iOS via a Mac (or CI on a Mac runner).

## Project structure

```
godot-hello-counter/
├── .gitignore
├── README.md
├── project.godot         # Godot project config
├── HelloCounter.csproj   # .NET project (Godot.NET.Sdk)
├── Main.tscn             # scene: VBox with label + count label + button
└── Main.cs               # counter logic
```

## Local development (Windows)

### Prerequisites

- **Godot 4.7 — .NET edition** (the "Mono" download, not the standard one)
  - Download from <https://godotengine.org/download/windows/> → pick **"Godot Engine - .NET"**
  - On this machine it's installed at
    `C:\Users\markw\tools\Godot_v4.7-stable_mono_win64\Godot_v4.7-stable_mono_win64.exe`
- **.NET SDK 8+** (already installed — this machine has 10.0.301)

> The copy at `C:\Program Files\Godot\Godot_v4.3-stable_win64.exe` is the
> **standard** edition — it cannot run C# projects. Use the `.NET` edition above.

### Run in the editor

1. Open **Godot .NET edition**
2. **Import** → browse to this folder → open `project.godot`
3. Press **F5** (or the Play button) — the counter window opens immediately

The editor handles `dotnet restore` and C# compilation automatically on first
run (it generates a `.godot/` folder with the glue code).

### Build / test from the command line

```sh
GODOT="C:/Users/markw/tools/Godot_v4.7-stable_mono_win64/Godot_v4.7-stable_mono_win64_console.exe"

# 1. Generate the C# glue (.godot/ folder) — needed once after a fresh clone
"$GODOT" --headless --import

# 2. Compile the C#
dotnet build HelloCounter.csproj -c Debug

# 3. Smoke-test: run the scene headless for 120 frames, expect a clean exit
"$GODOT" --headless --quit-after 120 res://Main.tscn
```

## CI (Windows, no Mac needed)

The workflow at
[`.github/workflows/godot-hello-counter-build.yml`](../../.github/workflows/godot-hello-counter-build.yml)
downloads Godot .NET 4.7, runs a headless import to generate the C# glue, then
builds the project with `dotnet build`. This verifies the code compiles on
every push.

## iOS export (CI on a Mac runner — no local Mac needed) ✅ verified

This produces an **unsigned** `HelloCounter.ipa` (~40 MB; arm64, with the C#
code AOT-compiled into `HelloCounter.framework`) that you sideload with
AltStore — proven working on a GitHub-hosted Mac, no local Mac required.

> Godot 4.7's C#/.NET iOS export is experimental and **requires macOS** (it
> refuses to run on Windows/Linux for .NET projects), which is why this half
> runs on `macos-latest`. The desktop build above still runs on Windows.

The workflow
[`.github/workflows/godot-hello-counter-ios.yml`](../../.github/workflows/godot-hello-counter-ios.yml)
runs on `macos-latest` and:

1. Installs the .NET `ios` workload + Godot 4.7 .NET editor + iOS export templates.
2. Imports the project, then exports **project-only**:
   `godot --headless --export-debug "iOS" build/ios/HelloCounter.xcodeproj`.
3. Builds the generated Xcode project **unsigned** with
   `xcodebuild -scheme HelloCounter ... CODE_SIGNING_ALLOWED=NO`.
4. Zips the `.app` into `HelloCounter.ipa`, uploaded as artifact `HelloCounter-ios-ipa`.

### Why the project is configured the way it is (non-obvious requirements)

Godot's headless C#/iOS export fails — often *silently* — without these. Each
was needed to get a green build:

| Setting / file | Why |
| --- | --- |
| `rendering/.../import_etc2_astc=true` in [`project.godot`](project.godot) | Mobile export requires VRAM ETC2/ASTC; without it `can_export()` returns false **with no error message**. |
| `application/export_project_only=true` in [`export_presets.cfg`](export_presets.cfg) | Otherwise Godot runs `xcodebuild archive` + `-exportArchive` itself, which **require code signing**. Project-only stops after generating the (AOT-compiled) Xcode project so we can build it unsigned. |
| [`HelloCounter.sln`](HelloCounter.sln) | C# export aborts with "no solution file exists"; the editor makes it on first GUI build, headless `--import` does not. |
| [`icon.svg`](icon.svg) + `config/icon` | iOS export generates the AppIcon set from the project icon; with none it errors `Invalid icon (...): ''`. |
| `app_store_team_id="AAAAAAAAAA"` (placeholder) | Export refuses an empty Team ID. Build is unsigned so the value is irrelevant; AltStore re-signs with your own identity. |
| `xcodebuild -scheme` (not `-target`) | `-derivedDataPath` requires `-scheme`; Godot generates a `HelloCounter` scheme. |

### Get the `.ipa` and install it

```sh
# open a PR or push to main to trigger CI (or: bash scripts/fetch-ipa.sh --dispatch)
bash scripts/fetch-ipa.sh            # waits for CI, downloads build/ipa/HelloCounter.ipa
bash scripts/fetch-ipa.sh --help     # options
```

Then sideload `HelloCounter.ipa` with **AltStore**, exactly as documented in
[`packages/ios-hello-world`](../ios-hello-world/README.md#altstore).
