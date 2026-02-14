import { useState, useEffect, useRef, useCallback } from 'react';
import type { TrackId, Track } from '../lib/tracks';
import { getTrackById } from '../lib/tracks';

export type RepeatMode = 'off' | 'all' | 'one';

interface UseAudioPlayerProps {
  tracks: Track[];
  initialTrackId?: TrackId;
}

export function useAudioPlayer({ tracks, initialTrackId }: UseAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<TrackId | null>(initialTrackId || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentTrack = currentTrackId ? getTrackById(currentTrackId) : null;

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => handleTrackEnd();
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleError = () => {
      setIsLoading(false);
      setError('Failed to load track');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Load track when currentTrackId changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    const wasPlaying = isPlaying;

    audio.src = currentTrack.audioUrl;
    audio.load();
    setCurrentTime(0);
    setError(null);

    if (wasPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setError('Failed to play track');
      });
    }
  }, [currentTrackId]);

  // Handle play/pause state
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        setError('Failed to play track');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    
    if (repeatMode === 'all') {
      if (currentIndex === tracks.length - 1) {
        setCurrentTrackId(tracks[0].id);
      } else {
        playNext();
      }
    } else {
      if (currentIndex < tracks.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentTrackId, tracks, repeatMode]);

  const play = useCallback((trackId?: TrackId) => {
    if (trackId) {
      setCurrentTrackId(trackId);
      setIsPlaying(true);
    } else if (currentTrackId) {
      setIsPlaying(true);
    } else if (tracks.length > 0) {
      setCurrentTrackId(tracks[0].id);
      setIsPlaying(true);
    }
  }, [currentTrackId, tracks]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const playNext = useCallback(() => {
    if (tracks.length === 0) return;

    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    
    if (shuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentIndex && tracks.length > 1);
      setCurrentTrackId(tracks[nextIndex].id);
    } else {
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentTrackId(tracks[nextIndex].id);
    }
  }, [currentTrackId, tracks, shuffle]);

  const playPrevious = useCallback(() => {
    if (tracks.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
    
    if (shuffle) {
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } while (prevIndex === currentIndex && tracks.length > 1);
      setCurrentTrackId(tracks[prevIndex].id);
    } else {
      const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
      setCurrentTrackId(tracks[prevIndex].id);
    }
  }, [currentTrackId, tracks, shuffle]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentTrack,
    currentTrackId,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    error,
    isLoading,
    play,
    pause,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    clearError,
  };
}

