import React from 'react';
import { Button } from '../ui/button';
import { Shuffle, Repeat, Repeat1 } from 'lucide-react';
import type { RepeatMode } from '../../hooks/useAudioPlayer';

interface PlaybackModesProps {
  shuffle: boolean;
  repeatMode: RepeatMode;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export function PlaybackModes({
  shuffle,
  repeatMode,
  onToggleShuffle,
  onToggleRepeat,
}: PlaybackModesProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleShuffle}
        className={shuffle ? 'text-foreground' : 'text-muted-foreground'}
      >
        <Shuffle className="h-4 w-4" strokeWidth={1.5} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleRepeat}
        className={repeatMode !== 'off' ? 'text-foreground' : 'text-muted-foreground'}
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <Repeat className="h-4 w-4" strokeWidth={1.5} />
        )}
      </Button>
    </div>
  );
}

