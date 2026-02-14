import React, { useEffect, useState } from 'react';
import { Header } from './components/header/Header';
import { PlayerSection } from './components/player/PlayerSection';
import { LibrarySection } from './components/library/LibrarySection';
import { ProfileSetupDialog } from './components/auth/ProfileSetupDialog';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { TRACKS } from './lib/tracks';
import { SiCaffeine } from 'react-icons/si';
import { Toaster } from './components/ui/sonner';

function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const player = useAudioPlayer({
    tracks: TRACKS,
    initialTrackId: TRACKS[0]?.id,
  });

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  // Register service worker for PWA support (production only)
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      // Use relative path for service worker to work with different base paths
      const swPath = new URL('/sw.js', window.location.origin).pathname;
      navigator.serviceWorker
        .register(swPath, { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <PlayerSection player={player} />
          <LibrarySection player={player} />
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <SiCaffeine className="h-3 w-3" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </div>
            <div>© {new Date().getFullYear()}</div>
          </div>
        </div>
      </footer>

      <ProfileSetupDialog
        open={showProfileSetup}
        onComplete={() => setShowProfileSetup(false)}
      />

      <Toaster />
    </div>
  );
}

export default App;
