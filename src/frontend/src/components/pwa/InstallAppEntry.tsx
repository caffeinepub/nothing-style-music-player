import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Download, Check } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function InstallAppEntry() {
  const { isInstallable, isInstalled, promptInstall } = usePwaInstall();
  const [showInstructions, setShowInstructions] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    const success = await promptInstall();
    setInstalling(false);
    
    if (!success) {
      setShowInstructions(true);
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // Show install button if installable
  if (isInstallable) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={handleInstall}
          disabled={installing}
          className="font-mono text-xs"
        >
          <Download className="h-3 w-3 mr-2" />
          {installing ? 'Installing...' : 'Install App'}
        </Button>

        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="font-mono">
            <DialogHeader>
              <DialogTitle className="tracking-tighter">Install Nothing Player</DialogTitle>
              <DialogDescription className="text-xs tracking-wide space-y-2">
                <p>To install this app on your device:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Open your browser menu (⋮)</li>
                  <li>Select "Add to Home screen" or "Install app"</li>
                  <li>Follow the prompts to complete installation</li>
                </ol>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Don't show anything if not installable and not installed
  return null;
}
