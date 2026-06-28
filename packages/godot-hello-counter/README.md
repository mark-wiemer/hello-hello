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

## iOS export (CI on a Mac runner — no local Mac needed)

> **Heads up:** Godot 4.7's **C#/.NET iOS export is experimental and *requires
> macOS*** — it refuses to run on Windows/Linux for .NET projects (verified
> locally). So unlike the desktop build, the iOS `.ipa` can only be produced on
> a Mac. The workflow below uses a GitHub-hosted Mac so you still don't need
> your own.

The workflow at
[`.github/workflows/godot-hello-counter-ios.yml`](../../.github/workflows/godot-hello-counter-ios.yml)
runs on `macos-latest` and:

1. Installs the .NET `ios` workload + Godot 4.7 .NET editor + iOS export templates.
2. Imports the project and runs
   `godot --headless --export-debug "iOS" build/ios/HelloCounter.xcodeproj`.
3. Builds the generated Xcode project with `xcodebuild` (unsigned,
   `CODE_SIGNING_ALLOWED=NO`).
4. Packages the `.app` into `HelloCounter.ipa` and uploads it as the
   `HelloCounter-ios-ipa` artifact.

The export preset lives in [`export_presets.cfg`](export_presets.cfg)
(bundle id `com.markwiemer.hellocounter`).

### Get the `.ipa` and install it

```sh
# after pushing iOS-affecting changes to main (or use --dispatch to trigger manually)
bash scripts/fetch-ipa.sh            # waits for CI, downloads build/ipa/HelloCounter.ipa
bash scripts/fetch-ipa.sh --help     # options
```

Then sideload `HelloCounter.ipa` with **AltStore**, exactly as documented in
[`packages/ios-hello-world`](../ios-hello-world/README.md#altstore).

> Because C#/.NET iOS export is experimental, expect the **first** Mac-runner
> run to possibly need a small tweak (e.g. the `xcodebuild -target` name — the
> workflow prints `xcodebuild -list` right before building so you can confirm
> it). Everything up to the Mac-only steps is verified.
