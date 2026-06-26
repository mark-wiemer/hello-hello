# Hello World — iOS (build on Windows via CI, install with a free Apple ID)

A minimal SwiftUI "Hello, world!" app built without a paid license or a Mac.
This does require Windows, not Linux.

GitHub Actions compiles the app into an unsigned `.ipa`,
then you can use **AltStore** on Windows
to sign and install it on your phone.

## Project structure

```
ios-hello-world/
├── .gitignore
├── README.md
├── HelloWorld.xcodeproj/
│   ├── project.pbxproj
│   └── xcshareddata/xcschemes/HelloWorld.xcscheme   # shared so CI can build it
└── HelloWorld/
    ├── HelloWorldApp.swift      # app entry point
    ├── ContentView.swift        # the "Hello, world!" screen
    └── Assets.xcassets/         # app icon + accent color placeholders
```

## Drawbacks

Limits of free signing:

- **Apps stop launching after 7 days** — let AltStore auto-refresh to reset the clock.
- **Max 3 sideloaded apps** on the device at once; **10 App IDs per 7 days**.
- (todo document minor restrictions like notifications, iCloud, etc.)

## Building

<a id="prerequisites"></a>

### Prerequisites

- A **GitHub account**, with this repo pushed to GitHub (the workflow runs there).
- A **Windows PC**, your **iPhone**, and a cord to connect them.
- [AltStore setup](https://faq.altstore.io/altstore-classic/how-to-install-altstore-windows)

### Build the `.ipa` with GitHub Actions

The workflow at
[`.github/workflows/ios-hello-world-build.yml`](../../.github/workflows/ios-hello-world-build.yml)
compiles the app into an unsigned `HelloWorld.ipa` on a GitHub-hosted Mac.
Run the helper script
[`scripts/fetch-ipa.sh`](scripts/fetch-ipa.sh)
to trigger/await the build and pull the `.ipa` down to your machine.

The script finds the workflow run for your current commit, waits for it to finish, then
downloads and unzips the artifact to
`packages/ios-hello-world/build/ipa/HelloWorld.ipa`.

That `.ipa` is unsigned. Now sign + install it from your PC.

### AltStore

1. Get `HelloWorld.ipa` onto the phone by any means necessary
   (probably email -> save to cloud drive OneDrive or iCloud -> open cloud drive app, then download to phone)
1. Open **AltStore** on the phone → **My Apps** → **＋** → pick `HelloWorld.ipa` → install.
1. Keep **AltServer** running on a PC on the **same Wi-Fi** network;
   AltStore then re-signs apps in the background before the 7-day expiry.
   (If it can't reach AltServer for 7+ days,
   open AltStore and refresh manually.)

## Updating the app later

Edit the Swift files → push → CI builds a fresh `.ipa` → download it →
re-install with AltStore (same Apple ID / bundle ID, so it updates in place).

## Troubleshooting

- **CI fails at "Build unsigned .app"** - open the failed step's log. The
  `xcodebuild -list` output (printed in the _Show toolchain_ step) confirms the
  `HelloWorld` scheme is visible. The build disables signing via
  `CODE_SIGNING_ALLOWED=NO`, so signing errors there usually mean a stale cached
  setting — re-run the job.
- **"Device not detected" in AltStore** - you may have installed
  iTunes/iCloud from the Microsoft Store. Uninstall those and install the versions from
  [AltStore setup](#prerequisites) instead
- **App installed but won't open** - you may have skipped the "Trust" step:
  Settings → General → VPN & Device Management → trust your developer profile.
- **"Unable to install - maximum number of apps"** - free signing allows
  3 sideloaded apps; remove one.
