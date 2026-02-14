import React from 'react';
import { SectionCard } from '../layout/SectionCard';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { PlaybackModes } from './PlaybackModes';
import { formatTime } from '../../lib/tracks';
import type { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface PlayerSectionProps {
  player: ReturnType<typeof useAudioPlayer>;
}

export function PlayerSection({ player }: PlayerSectionProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    error,
    isLoading,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    clearError,
  } = player;

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  // Enhanced error message for backend connection issues
  const getErrorMessage = (errorMsg: string): string => {
    if (errorMsg.includes('canister') || errorMsg.includes('actor') || errorMsg.includes('not available')) {
      return 'Unable to connect to backend service. Playback will continue with local tracks.';
    }
    return errorMsg;
  };

  return (
    <SectionCard className="p-6">
      {error && (
        <div className="mb-4 flex items-center justify-between bg-destructive/10 border border-destructive/20 p-3">
          <div className="flex items-center gap-2 text-sm text-destructive font-mono">
            <AlertCircle className="h-4 w-4" />
            <span>{getErrorMessage(error)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-xs font-mono"
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {/* Now Playing */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-mono tracking-tighter">
            {currentTrack?.title || 'No track selected'}
          </h2>
          <p className="text-sm text-muted-foreground font-mono tracking-wide">
            {currentTrack?.artist || '—'}
          </p>
        </div>

        {/* Seek Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            disabled={!currentTrack || isLoading}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{duration ? formatTime(duration) : '0:00'}</span>
          </div>
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-2">
          <PlaybackModes
            shuffle={shuffle}
            repeatMode={repeatMode}
            onToggleShuffle={toggleShuffle}
            onToggleRepeat={toggleRepeat}
          />

          <div className="flex items-center gap-1 mx-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPrevious}
              disabled={!currentTrack || isLoading}
            >
              <SkipBack className="h-5 w-5" strokeWidth={1.5} />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={togglePlayPause}
              disabled={!currentTrack || isLoading}
              className="h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" strokeWidth={1.5} />
              ) : (
                <Play className="h-6 w-6 ml-0.5" strokeWidth={1.5} />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={playNext}
              disabled={!currentTrack || isLoading}
            >
              <SkipForward className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Volume2 className="h-4 w-4" strokeWidth={1.5} />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
