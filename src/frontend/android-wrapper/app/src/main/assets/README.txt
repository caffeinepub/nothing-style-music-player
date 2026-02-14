# Android Wrapper Assets Directory

This directory should contain the built web application for offline bundling.

## Setup Instructions

Before building the Android APK, copy the web build output here:

1. Build the web application:
   cd frontend
   pnpm build

2. Copy the build output to this directory:
   rm -rf android-wrapper/app/src/main/assets/web
   mkdir -p android-wrapper/app/src/main/assets/web
   cp -r dist/* android-wrapper/app/src/main/assets/web/

3. Build the Android APK:
   cd android-wrapper
   ./gradlew assembleRelease

## Expected Structure

After copying, this directory should contain:

assets/
└── web/
    ├── index.html
    ├── assets/
    │   ├── audio/
    │   │   ├── sample-track-1.mp3
    │   │   ├── sample-track-2.mp3
    │   │   └── sample-track-3.mp3
    │   ├── *.js
    │   ├── *.css
    │   └── ...
    ├── icons/
    └── manifest.webmanifest

## Notes

- The web/ directory is served from file:///android_asset/web/ in the WebView
- All paths in the web build must be relative for offline loading
- The service worker is registered but may have limited functionality in WebView
- Audio files must be included for offline playback
