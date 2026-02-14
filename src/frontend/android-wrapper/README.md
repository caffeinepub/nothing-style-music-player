# Nothing Player - Android Wrapper

This directory contains an Android wrapper that packages the Nothing Player web application as a standalone offline APK.

## Overview

The Android wrapper uses a WebView to load and display the bundled web application from local assets. This allows the app to run completely offline without requiring a hosted URL.

## Architecture

- **MainActivity.kt**: Loads the web app from `file:///android_asset/web/index.html`
- **WebView Configuration**: Enables JavaScript, DOM storage, and local file access
- **Asset Serving**: The entire web build is bundled in `app/src/main/assets/web/`
- **Offline-First**: No network requests are made for the core app shell and sample tracks

## Prerequisites

- Android Studio (latest stable)
- Android SDK API 24+ (Android 7.0+)
- Gradle 8.0+
- JDK 17+

## Build Instructions

### Quick Build

From the project root:

