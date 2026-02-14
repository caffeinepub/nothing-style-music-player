import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useNetworkStatus } from './useNetworkStatus';
import type { UserProfile } from '../backend';
import type { TrackId } from '../lib/tracks';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isOnline } = useNetworkStatus();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isOnline,
    retry: false,
    staleTime: isOnline ? 0 : Infinity,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!isOnline) throw new Error('Cannot save profile while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetFavorites() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isOnline } = useNetworkStatus();

  return useQuery<TrackId[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFavorites();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && isOnline,
    retry: false,
    staleTime: isOnline ? 0 : Infinity,
  });
}

export function useSaveFavorites() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (favorites: TrackId[]) => {
      if (!isOnline) throw new Error('Cannot save favorites while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.saveFavorites(favorites);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Legacy single playlist (for migration compatibility)
export function useGetPlaylist() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isOnline } = useNetworkStatus();

  return useQuery<TrackId[]>({
    queryKey: ['playlist'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPlaylist();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && isOnline,
    retry: false,
    staleTime: isOnline ? 0 : Infinity,
  });
}

export function useSavePlaylist() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlist: TrackId[]) => {
      if (!isOnline) throw new Error('Cannot save playlist while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.savePlaylist(playlist);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlist'] });
    },
  });
}

// Multi-playlist hooks
export function useGetPlaylistNames() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isOnline } = useNetworkStatus();

  return useQuery<string[]>({
    queryKey: ['playlistNames'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPlaylistNames();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && isOnline,
    retry: false,
    staleTime: isOnline ? 0 : Infinity,
  });
}

export function useGetActivePlaylist() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isOnline } = useNetworkStatus();

  return useQuery<TrackId[]>({
    queryKey: ['activePlaylist'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getActivePlaylist();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && isOnline,
    retry: false,
    staleTime: isOnline ? 0 : Infinity,
  });
}

export function useGetPlaylistByName() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!isOnline) throw new Error('Cannot fetch playlist while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.getPlaylistByName(name);
    },
  });
}

export function useCreatePlaylist() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, tracks }: { name: string; tracks: TrackId[] }) => {
      if (!isOnline) throw new Error('Cannot create playlist while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.savePlaylistByName(name, tracks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlistNames'] });
      queryClient.invalidateQueries({ queryKey: ['activePlaylist'] });
    },
  });
}

export function useUpdatePlaylistTracks() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, tracks }: { name: string; tracks: TrackId[] }) => {
      if (!isOnline) throw new Error('Cannot update playlist while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.savePlaylistByName(name, tracks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activePlaylist'] });
    },
  });
}

export function useSetActivePlaylist() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!isOnline) throw new Error('Cannot set active playlist while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.setActivePlaylist(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activePlaylist'] });
    },
  });
}

export function useDeletePlaylist() {
  const { actor } = useActor();
  const { isOnline } = useNetworkStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!isOnline) throw new Error('Cannot delete playlist while offline');
      if (!actor) throw new Error('Actor not available');
      return actor.deletePlaylist(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlistNames'] });
      queryClient.invalidateQueries({ queryKey: ['activePlaylist'] });
    },
  });
}
