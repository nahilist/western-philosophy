# PWA and TWA Android release

The website is the source of truth. The Android app is a Trusted Web Activity (TWA), so existing routes, authentication, APIs, and future website updates remain shared with the app.

## 1. Deploy and verify the PWA

Deploy the current website changes to `https://western-philosophy.vercel.app`, then verify:

- `/manifest.webmanifest` returns the app manifest.
- `/sw.js` returns JavaScript with `Cache-Control: no-cache, no-store, must-revalidate`.
- `/offline` loads successfully.
- Chrome shows the site as installable.

## 2. Install the Android build tooling

Install Node.js (already used by this repository) and Bubblewrap:

```powershell
npm install --global @bubblewrap/cli
```

Bubblewrap can download a compatible JDK and Android command-line tools during its first run. Android Studio is optional but recommended for emulator/device debugging. Expo Go is not required for a TWA because the app wraps the existing PWA rather than creating a separate React Native application.

## 3. Generate the Android project

From a separate release folder, run:

```powershell
bubblewrap init --manifest https://western-philosophy.vercel.app/manifest.webmanifest
```

Recommended values:

- App name: `PHILOSOPHY Φ`
- Package/application ID: `app.vercel.western_philosophy.twa`
- Host: `western-philosophy.vercel.app`
- Start URL: `/`
- Display mode: `standalone`

Keep the generated signing keystore and its passwords in a secure password manager. Never commit the keystore or passwords to Git.

## 4. Connect the website and Android app

Obtain the SHA-256 fingerprint for both the local release key and Google Play App Signing key. Publish this file at:

`https://western-philosophy.vercel.app/.well-known/assetlinks.json`

Its final content must use the exact Android package name and real certificate fingerprints:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.vercel.western_philosophy.twa",
      "sha256_cert_fingerprints": [
        "8C:4C:DF:FC:47:E4:AC:48:34:15:70:A2:1F:7F:CC:03:E1:A0:96:9D:01:17:CA:B0:C2:29:2A:EA:4B:4B:5C:B5"
      ]
    }
  }
]
```

Do not deploy a placeholder fingerprint. Without a valid Digital Asset Link, Android opens the website with browser chrome instead of the fullscreen TWA experience.

## 5. Build and test

```powershell
bubblewrap build
bubblewrap install
```

The build produces APK/AAB artifacts. Test login, course navigation, forms, audio, offline fallback, updates, and Android back-button behavior on a physical device before uploading the AAB to Play Console.
