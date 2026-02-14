import React from 'react';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export function OfflineNotice() {
  return (
    <Alert className="border-warning/20 bg-warning/10">
      <WifiOff className="h-4 w-4 text-warning" />
      <AlertDescription className="text-sm font-mono text-warning ml-2">
        You're offline. Sample tracks will play, but sign-in and sync features require an internet connection.
      </AlertDescription>
    </Alert>
  );
}
