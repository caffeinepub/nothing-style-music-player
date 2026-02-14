import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Lock } from 'lucide-react';

interface AuthGateNoticeProps {
  feature: string;
}

export function AuthGateNotice({ feature }: AuthGateNoticeProps) {
  const { identity } = useInternetIdentity();

  if (identity) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
      <Lock className="h-3 w-3" />
      <span>Sign in to save {feature}</span>
    </div>
  );
}

