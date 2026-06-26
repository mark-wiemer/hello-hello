# Hello World — iOS (build on Windows via CI, install with a free Apple ID)

A minimal SwiftUI "Hello, world!" app built without a paid license or local Mac.

GitHub Actions compiles the app into an unsigned `.ipa`,
then you can use **Sideloadly** or **AltStore** on Windows
to sign and install it on your phone.

## Drawbacks

Limits of free signing:

- **Apps stop launching after 7 days** — just re-run Sideloadly (or let AltStore
  auto-refresh) to reset the clock.
- **Max 3 sideloaded apps** on the device at once; **10 App IDs per 7 days**.
- No push notifications / iCloud / some capabilities.

## Prerequisites

- A **GitHub account**, with this repo pushed to GitHub (the workflow runs there).
- A **free Apple ID**. 💡 Consider a _secondary_ Apple ID just for sideloading, so you
  never put credentials for your main account into a third-party tool.
- A **Windows PC**, your **iPhone**, and a **USB cable**.

---

## Part A — Build the `.ipa` with GitHub Actions

The workflow lives at [`.github/workflows/ios-hello-world-build.yml`](../.github/workflows/ios-hello-world-build.yml)
and runs automatically on pushes that touch `ios-hello-world/**`, or on demand.

1. **Push the branch** containing this folder to GitHub (the workflow triggers on the
   `main` and `ios` branches, or any PR that touches `ios-hello-world/**`).
2. On GitHub, open the **Actions** tab. (You can also trigger it manually: select
   _iOS Hello World - Build (unsigned IPA)_ → **Run workflow**.)
3. Click into the latest run and wait for it to go green (~2–4 min).
4. In the run's **Summary** page, under **Artifacts**, download **`HelloWorld-ipa`**.
   GitHub gives you `HelloWorld-ipa.zip` — **unzip it** to get `HelloWorld.ipa`.

That `.ipa` is unsigned. Now sign + install it from your PC.

---

## Part B — Install on your iPhone from Windows

Pick **one** tool. Sideloadly is the quickest way to a first success; AltStore is nicer
long-term because it refreshes the 7-day signing for you.

### Option 1 — Sideloadly (simplest; manual 7-day refresh)

1. Install Apple's **iTunes** _and_ **iCloud** **from apple.com** — _not_ the Microsoft
   Store versions. Sideloadly needs the Apple device drivers/libraries that the
   apple.com installers provide. (This is the #1 cause of "device not detected".)
2. Download and install **Sideloadly** from <https://sideloadly.io>.
3. Connect your iPhone via USB; on the phone tap **Trust** and enter your passcode.
4. Open Sideloadly. It should show your device. Drag **`HelloWorld.ipa`** into the
   **IPA** field.
5. Enter your **Apple ID** in the Apple account field. Click **Start**.
6. Enter your Apple ID password when prompted. If your account has two-factor auth,
   you may be asked for an **app-specific password** (create one at
   <https://account.apple.com> → Sign-In & Security → App-Specific Passwords).
7. When it finishes, on the **iPhone** go to **Settings → General → VPN & Device
   Management**, tap your Apple ID under **Developer App**, and tap **Trust**.
8. Launch **HelloWorld** from the home screen. 🎉
9. **Every 7 days**, reconnect and click **Start** again to refresh.

### Option 2 — AltStore (more setup; auto-refreshes over Wi-Fi)

1. Install Apple's **iTunes** and **iCloud** from **apple.com** (same driver reason as
   above).
2. Download **AltServer** from <https://altstore.io> and install it on your PC. It runs
   in the system tray.
3. Connect the iPhone via USB and **Trust** it.
4. Click the AltServer tray icon → **Install AltStore** → select your device → sign in
   with your Apple ID. This puts the **AltStore** app on your phone.
5. On the iPhone: **Settings → General → VPN & Device Management** → **Trust** your
   Apple ID developer profile.
6. Get `HelloWorld.ipa` onto the phone (e.g. AirDrop isn't available from Windows, so
   use **iCloud Drive**, email it to yourself, or a USB transfer), then open **AltStore**
   on the phone → **My Apps** → **＋** → pick `HelloWorld.ipa` → install.
7. Keep **AltServer** running on a PC on the **same Wi-Fi** network; AltStore then
   re-signs apps in the background before the 7-day expiry. (If it can't reach
   AltServer for >7 days, open AltStore and refresh manually.)

---

## Updating the app later

Edit the Swift files → push → CI builds a fresh `.ipa` → download it → re-install with
Sideloadly/AltStore (same Apple ID / bundle ID, so it updates in place).

## Want to personalize the bundle ID?

Optional. Sideloadly/AltStore register an App ID under your Apple ID automatically, so
the default `com.example.HelloWorld` will work. If you prefer your own, change
`PRODUCT_BUNDLE_IDENTIFIER` in `HelloWorld.xcodeproj/project.pbxproj` to something like
`com.yourname.HelloWorld` before building.

## Fastest one-off alternative: borrow a Mac

If you can sit at any Mac for ~10 minutes, the simplest path of all is: install Xcode,
open `HelloWorld.xcodeproj`, sign in with a free Apple ID under _Settings → Accounts_,
pick your plugged-in iPhone, and press **Run**. No CI, no sideloading tool. (Same 7-day
expiry applies.)

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

## Troubleshooting

- **CI fails at "Build unsigned .app"** — open the failed step's log. The
  `xcodebuild -list` output (printed in the _Show toolchain_ step) confirms the
  `HelloWorld` scheme is visible. The build disables signing via
  `CODE_SIGNING_ALLOWED=NO`, so signing errors there usually mean a stale cached
  setting — re-run the job.
- **"Device not detected" in Sideloadly/AltStore** — you almost certainly installed
  iTunes/iCloud from the Microsoft Store. Uninstall those and install the versions from
  apple.com instead.
- **App installed but won't open** — you skipped the _Trust_ step:
  Settings → General → VPN & Device Management → trust your developer profile.
- **"Unable to install — maximum number of apps"** — free signing allows 3 sideloaded
  apps; remove one.
