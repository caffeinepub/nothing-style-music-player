package com.nothingplayer.offlinewrapper

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        setContentView(webView)

        // Configure WebView for offline asset loading
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.databaseEnabled = true
        webSettings.allowFileAccess = true
        webSettings.allowContentAccess = true
        webSettings.mediaPlaybackRequiresUserGesture = false
        webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        
        // Enable caching for better offline performance
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        webSettings.setAppCacheEnabled(true)
        
        // Load the bundled web app from assets
        webView.loadUrl("file:///android_asset/web/index.html")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
