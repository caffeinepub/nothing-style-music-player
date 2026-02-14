import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Plus, MoreVertical, Trash2, Edit2, List } from 'lucide-react';
import { useGetPlaylistNames, useCreatePlaylist, useSetActivePlaylist, useDeletePlaylist, useUpdatePlaylistTracks, useGetActivePlaylist } from '../../hooks/useQueries';

interface PlaylistManagerProps {
  activePlaylistName: string | null;
  onPlaylistChange: () => void;
}

export function PlaylistManager({ activePlaylistName, onPlaylistChange }: PlaylistManagerProps) {
  const { data: playlistNames = [] } = useGetPlaylistNames();
  const { data: activePlaylistTracks = [] } = useGetActivePlaylist();
  const createPlaylist = useCreatePlaylist();
  const setActivePlaylist = useSetActivePlaylist();
  const deletePlaylist = useDeletePlaylist();
  const updatePlaylistTracks = useUpdatePlaylistTracks();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [renamePlaylistName, setRenamePlaylistName] = useState('');
  const [playlistToRename, setPlaylistToRename] = useState<string | null>(null);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      await createPlaylist.mutateAsync({ name: newPlaylistName.trim(), tracks: [] });
      setNewPlaylistName('');
      setShowCreateDialog(false);
      onPlaylistChange();
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  const handleSelectPlaylist = async (name: string) => {
    if (name === activePlaylistName) return;

    try {
      await setActivePlaylist.mutateAsync(name);
      onPlaylistChange();
    } catch (error) {
      console.error('Failed to set active playlist:', error);
    }
  };

  const handleDeletePlaylist = async (name: string) => {
    if (!confirm(`Delete playlist "${name}"?`)) return;

    try {
      await deletePlaylist.mutateAsync(name);
      onPlaylistChange();
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const handleRenamePlaylist = async () => {
    if (!renamePlaylistName.trim() || !playlistToRename) return;

    try {
      // Create new playlist with new name and same tracks
      await createPlaylist.mutateAsync({ 
        name: renamePlaylistName.trim(), 
        tracks: activePlaylistName === playlistToRename ? activePlaylistTracks : [] 
      });
      
      // If it was the active playlist, set the new one as active
      if (activePlaylistName === playlistToRename) {
        await setActivePlaylist.mutateAsync(renamePlaylistName.trim());
      }
      
      // Delete old playlist
      await deletePlaylist.mutateAsync(playlistToRename);
      
      setRenamePlaylistName('');
      setPlaylistToRename(null);
      setShowRenameDialog(false);
      onPlaylistChange();
    } catch (error) {
      console.error('Failed to rename playlist:', error);
    }
  };

  const openRenameDialog = (name: string) => {
    setPlaylistToRename(name);
    setRenamePlaylistName(name);
    setShowRenameDialog(true);
  };

  const isPending = createPlaylist.isPending || setActivePlaylist.isPending || deletePlaylist.isPending || updatePlaylistTracks.isPending;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending} className="font-mono text-xs">
            <List className="h-3 w-3 mr-2" strokeWidth={1.5} />
            {activePlaylistName || 'Select Playlist'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {playlistNames.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground font-mono">
              No playlists yet
            </div>
          ) : (
            playlistNames.map((name) => (
              <DropdownMenuItem
                key={name}
                onClick={() => handleSelectPlaylist(name)}
                className="font-mono text-xs flex items-center justify-between group"
              >
                <span className={activePlaylistName === name ? 'font-bold' : ''}>
                  {name}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      openRenameDialog(name);
                    }}
                  >
                    <Edit2 className="h-3 w-3" strokeWidth={1.5} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(name);
                    }}
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending} className="font-mono text-xs">
            <Plus className="h-3 w-3 mr-2" strokeWidth={1.5} />
            New
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono">Create Playlist</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Enter a name for your new playlist
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Playlist name"
            className="font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreatePlaylist();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim() || createPlaylist.isPending}
              className="font-mono text-xs"
            >
              {createPlaylist.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono">Rename Playlist</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Enter a new name for "{playlistToRename}"
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renamePlaylistName}
            onChange={(e) => setRenamePlaylistName(e.target.value)}
            placeholder="New playlist name"
            className="font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenamePlaylist();
              }
            }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRenameDialog(false);
                setPlaylistToRename(null);
                setRenamePlaylistName('');
              }}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenamePlaylist}
              disabled={!renamePlaylistName.trim() || isPending}
              className="font-mono text-xs"
            >
              {isPending ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
