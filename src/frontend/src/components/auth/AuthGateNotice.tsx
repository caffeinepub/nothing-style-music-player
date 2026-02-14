import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Lock, WifiOff } from 'lucide-react';

interface AuthGateNoticeProps {
  feature: string;
}

export function AuthGateNotice({ feature }: AuthGateNoticeProps) {
  const { identity } = useInternetIdentity();
  const { isOnline } = useNetworkStatus();

  if (identity) return null;

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-xs text-warning font-mono">
        <WifiOff className="h-3 w-3" />
        <span>Offline - sign in requires internet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
      <Lock className="h-3 w-3" />
      <span>Sign in to save {feature}</span>
    </div>
  );
}
