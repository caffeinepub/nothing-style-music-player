import React, { useMemo, useEffect, useState } from 'react';
import { SectionCard } from '../layout/SectionCard';
import { TrackRow } from './TrackRow';
import { PlaylistReorderControls } from './PlaylistReorderControls';
import { PlaylistManager } from './PlaylistManager';
import { AuthGateNotice } from '../auth/AuthGateNotice';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { 
  useGetFavorites, 
  useSaveFavorites, 
  useGetPlaylist, 
  useGetPlaylistNames, 
  useGetActivePlaylist, 
  useUpdatePlaylistTracks,
  useCreatePlaylist 
} from '../../hooks/useQueries';
import { TRACKS } from '../../lib/tracks';
import type { Track, TrackId } from '../../lib/tracks';
import type { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface LibrarySectionProps {
  player: ReturnType<typeof useAudioPlayer>;
}

export function LibrarySection({ player }: LibrarySectionProps) {
  const { identity } = useInternetIdentity();
  const { data: favorites = [], isLoading: favoritesLoading } = useGetFavorites();
  const { data: legacyPlaylist = [], isLoading: legacyPlaylistLoading } = useGetPlaylist();
  const { data: playlistNames = [], isLoading: playlistNamesLoading } = useGetPlaylistNames();
  const { data: activePlaylistTracks = [], isLoading: activePlaylistLoading } = useGetActivePlaylist();
  const saveFavorites = useSaveFavorites();
  const updatePlaylistTracks = useUpdatePlaylistTracks();
  const createPlaylist = useCreatePlaylist();

  const [activePlaylistName, setActivePlaylistName] = useState<string | null>(null);
  const [migrationDone, setMigrationDone] = useState(false);

  const isAuthenticated = !!identity;

  // Migration: Create default playlist from legacy single playlist
  useEffect(() => {
    if (
      isAuthenticated &&
      !playlistNamesLoading &&
      !legacyPlaylistLoading &&
      !migrationDone &&
      playlistNames.length === 0 &&
      legacyPlaylist.length > 0
    ) {
      createPlaylist.mutate(
        { name: 'My Playlist', tracks: legacyPlaylist },
        {
          onSuccess: () => {
            setMigrationDone(true);
            setActivePlaylistName('My Playlist');
          },
        }
      );
    }
  }, [isAuthenticated, playlistNames, legacyPlaylist, playlistNamesLoading, legacyPlaylistLoading, migrationDone]);

  // Set active playlist name
  useEffect(() => {
    if (isAuthenticated && playlistNames.length > 0 && !activePlaylistName) {
      setActivePlaylistName(playlistNames[0]);
    }
  }, [isAuthenticated, playlistNames, activePlaylistName]);

  // Order tracks based on active playlist or default order
  const orderedTracks = useMemo(() => {
    if (!isAuthenticated || activePlaylistTracks.length === 0) {
      return TRACKS;
    }

    const trackMap = new Map(TRACKS.map(t => [t.id, t]));
    const ordered: Track[] = [];
    
    activePlaylistTracks.forEach(id => {
      const track = trackMap.get(id);
      if (track) {
        ordered.push(track);
      }
    });

    return ordered;
  }, [activePlaylistTracks, isAuthenticated]);

  // Initialize playlist with all tracks if empty
  useEffect(() => {
    if (
      isAuthenticated &&
      activePlaylistName &&
      activePlaylistTracks.length === 0 &&
      !activePlaylistLoading &&
      playlistNames.includes(activePlaylistName)
    ) {
      const defaultOrder = TRACKS.map(t => t.id);
      updatePlaylistTracks.mutate({ name: activePlaylistName, tracks: defaultOrder });
    }
  }, [isAuthenticated, activePlaylistName, activePlaylistTracks, activePlaylistLoading, playlistNames]);

  const handleToggleFavorite = (trackId: TrackId) => {
    if (!isAuthenticated) return;

    const newFavorites = favorites.includes(trackId)
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];

    saveFavorites.mutate(newFavorites);
  };

  const handleMoveTrack = (index: number, direction: 'up' | 'down') => {
    if (!isAuthenticated || !activePlaylistName) return;

    const newOrder = [...orderedTracks.map(t => t.id)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    updatePlaylistTracks.mutate({ name: activePlaylistName, tracks: newOrder });
  };

  const handleAddToPlaylist = (trackId: TrackId) => {
    if (!isAuthenticated || !activePlaylistName) return;

    const newTracks = [...activePlaylistTracks, trackId];
    updatePlaylistTracks.mutate({ name: activePlaylistName, tracks: newTracks });
  };

  const handleRemoveFromPlaylist = (trackId: TrackId) => {
    if (!isAuthenticated || !activePlaylistName) return;

    const newTracks = activePlaylistTracks.filter(id => id !== trackId);
    updatePlaylistTracks.mutate({ name: activePlaylistName, tracks: newTracks });
  };

  const isInPlaylist = (trackId: TrackId) => {
    return activePlaylistTracks.includes(trackId);
  };

  return (
    <SectionCard>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-mono text-sm tracking-wide uppercase">Library</h3>
          {isAuthenticated && (
            <PlaylistManager
              activePlaylistName={activePlaylistName}
              onPlaylistChange={() => {
                // Trigger re-fetch by clearing state
                setActivePlaylistName(null);
              }}
            />
          )}
        </div>
        {!isAuthenticated && <AuthGateNotice feature="playlists & favorites" />}
      </div>

      <div>
        {orderedTracks.length === 0 && isAuthenticated ? (
          <div className="p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              This playlist is empty. Add tracks from the library below.
            </p>
          </div>
        ) : null}
        
        {orderedTracks.map((track, index) => (
          <div key={track.id} className="flex items-center">
            <div className="flex-1">
              <TrackRow
                track={track}
                isPlaying={player.isPlaying}
                isCurrent={player.currentTrackId === track.id}
                isFavorite={favorites.includes(track.id)}
                isInPlaylist={isInPlaylist(track.id)}
                onPlay={() => player.play(track.id)}
                onToggleFavorite={() => handleToggleFavorite(track.id)}
                onAddToPlaylist={() => handleAddToPlaylist(track.id)}
                onRemoveFromPlaylist={() => handleRemoveFromPlaylist(track.id)}
                canFavorite={isAuthenticated}
                canManagePlaylist={isAuthenticated}
              />
            </div>
            {isAuthenticated && isInPlaylist(track.id) && (
              <div className="pr-2">
                <PlaylistReorderControls
                  onMoveUp={() => handleMoveTrack(index, 'up')}
                  onMoveDown={() => handleMoveTrack(index, 'down')}
                  canMoveUp={index > 0}
                  canMoveDown={index < orderedTracks.length - 1}
                  disabled={updatePlaylistTracks.isPending}
                />
              </div>
            )}
          </div>
        ))}

        {/* Show all tracks not in playlist */}
        {isAuthenticated && activePlaylistTracks.length > 0 && (
          <>
            <div className="p-3 border-t-2 border-border bg-muted/30">
              <h4 className="font-mono text-xs tracking-wide uppercase text-muted-foreground">
                Available Tracks
              </h4>
            </div>
            {TRACKS.filter(track => !isInPlaylist(track.id)).map((track) => (
              <div key={track.id} className="flex items-center">
                <div className="flex-1">
                  <TrackRow
                    track={track}
                    isPlaying={player.isPlaying}
                    isCurrent={player.currentTrackId === track.id}
                    isFavorite={favorites.includes(track.id)}
                    isInPlaylist={false}
                    onPlay={() => player.play(track.id)}
                    onToggleFavorite={() => handleToggleFavorite(track.id)}
                    onAddToPlaylist={() => handleAddToPlaylist(track.id)}
                    onRemoveFromPlaylist={() => handleRemoveFromPlaylist(track.id)}
                    canFavorite={isAuthenticated}
                    canManagePlaylist={isAuthenticated}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </SectionCard>
  );
}
