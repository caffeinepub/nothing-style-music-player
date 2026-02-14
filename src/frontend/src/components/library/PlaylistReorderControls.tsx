import React from 'react';
import { Button } from '../ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface PlaylistReorderControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled: boolean;
}

export function PlaylistReorderControls({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  disabled,
}: PlaylistReorderControlsProps) {
  return (
    <div className="flex flex-col gap-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMoveUp}
        disabled={disabled || !canMoveUp}
        className="h-6 w-6"
      >
        <ChevronUp className="h-3 w-3" strokeWidth={1.5} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMoveDown}
        disabled={disabled || !canMoveDown}
        className="h-6 w-6"
      >
        <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
      </Button>
    </div>
  );
}

