<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Gactn3287tDgeuMmY19UHPL2HwVue8eo

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Metro/HMR troubleshooting (iOS dev client)

If you see an HMR/Metro unavailable warning, start Metro on LAN with the fixed host:

`npm run ios:lan`

The `ios:lan` script pins Metro to:

`192.168.1.37:8081`

Native fallback is also set in `ios/ChronoLens/AppDelegate.swift` for Debug builds, so `RCTBundleURLProvider` resolves the same host/port.
