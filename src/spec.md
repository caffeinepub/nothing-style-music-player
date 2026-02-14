# Specification

## Summary
**Goal:** Fix the production “canister ID not resolved” error and make the app installable on Android with an APK-like PWA experience.

**Planned changes:**
- Investigate and correct production canister/actor configuration so the deployed frontend reliably targets the production canister (no localhost/dev canister resolution in production).
- Add PWA support: web app manifest, required icons, and a production-registered service worker that caches the app shell for offline UI loading.
- Add an in-app “Install app” entry point that triggers the PWA install prompt when supported, and otherwise shows concise English guidance or hides the action when not applicable.

**User-visible outcome:** Opening the production URL works without “canister ID not resolved,” core app flows work reliably, and Android users can install the app from the browser and launch it in standalone mode with an in-app install option.
