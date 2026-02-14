import React from 'react';
import { Button } from '../ui/button';
import { Play, Pause, Heart, Plus, Minus } from 'lucide-react';
import { formatTime } from '../../lib/tracks';
import type { Track } from '../../lib/tracks';

interface TrackRowProps {
  track: Track;
  isPlaying: boolean;
  isCurrent: boolean;
  isFavorite: boolean;
  isInPlaylist: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
  onAddToPlaylist: () => void;
  onRemoveFromPlaylist: () => void;
  canFavorite: boolean;
  canManagePlaylist: boolean;
}

export function TrackRow({
  track,
  isPlaying,
  isCurrent,
  isFavorite,
  isInPlaylist,
  onPlay,
  onToggleFavorite,
  onAddToPlaylist,
  onRemoveFromPlaylist,
  canFavorite,
  canManagePlaylist,
}: TrackRowProps) {
  return (
    <div
      className={`group flex items-center gap-4 p-3 border-b border-border last:border-b-0 transition-colors ${
        isCurrent ? 'bg-accent' : 'hover:bg-muted/50'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlay}
        className="h-8 w-8 shrink-0"
      >
        {isCurrent && isPlaying ? (
          <Pause className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <Play className="h-4 w-4 ml-0.5" strokeWidth={1.5} />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm tracking-tight truncate">
          {track.title}
        </div>
        <div className="font-mono text-xs text-muted-foreground tracking-wide truncate">
          {track.artist}
        </div>
      </div>

      <div className="font-mono text-xs text-muted-foreground tabular-nums">
        {formatTime(track.duration)}
      </div>

      {canManagePlaylist && (
        <Button
          variant="ghost"
          size="icon"
          onClick={isInPlaylist ? onRemoveFromPlaylist : onAddToPlaylist}
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          title={isInPlaylist ? 'Remove from playlist' : 'Add to playlist'}
        >
          {isInPlaylist ? (
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          )}
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFavorite}
        disabled={!canFavorite}
        className={`h-8 w-8 shrink-0 ${isFavorite ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Heart
          className="h-4 w-4"
          strokeWidth={1.5}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </Button>
    </div>
  );
}
