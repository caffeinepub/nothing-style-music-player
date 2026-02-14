import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { LoginButton } from '../auth/LoginButton';
import { InstallAppEntry } from '../pwa/InstallAppEntry';
import { OfflineNotice } from '../offline/OfflineNotice';
import { Circle } from 'lucide-react';

export function Header() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { isOnline } = useNetworkStatus();

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Circle className="h-6 w-6" strokeWidth={1} />
            <h1 className="text-xl font-mono tracking-tighter uppercase">Nothing Player</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <InstallAppEntry />
            {identity && userProfile && (
              <span className="text-sm font-mono tracking-wide text-muted-foreground">
                {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
        
        {!isOnline && (
          <div className="mt-4">
            <OfflineNotice />
          </div>
        )}
      </div>
    </header>
  );
}
