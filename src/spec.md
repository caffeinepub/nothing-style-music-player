# Specification

## Summary
**Goal:** Package the existing PWA as a fully offline Android APK and improve offline UX so the app shell and sample tracks work without network connectivity.

**Planned changes:**
- Add an Android wrapper project (WebView/Trusted Web Activity style) that bundles the built web app assets inside the APK so it can launch without a hosted URL.
- Improve offline mode behavior in the UI: ensure the app shell loads, sample tracks remain playable, and backend/Internet Identity-dependent actions show clear English offline messaging instead of failing or spinning indefinitely.
- Expand service worker caching to cache all required built static assets for full offline app-shell reloads, while continuing to exclude canister API traffic from caching and preserving cache versioning/cleanup.
- Add an English BUILD.md documenting prerequisites and exact steps/commands to build the web app, bundle it into the Android wrapper, and produce an installable offline APK (including expected offline limitations).

**User-visible outcome:** Users can install an Android APK that opens to the main UI in airplane mode, play bundled sample tracks offline, and see clear English messages for features that require an internet connection.
