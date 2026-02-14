export type TrackId = string;

export interface Track {
  id: TrackId;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Ambient Dawn',
    artist: 'Digital Soundscapes',
    duration: 180,
    audioUrl: '/assets/audio/sample-track-1.mp3'
  },
  {
    id: 'track-2',
    title: 'Minimal Pulse',
    artist: 'Electronic Collective',
    duration: 210,
    audioUrl: '/assets/audio/sample-track-2.mp3'
  },
  {
    id: 'track-3',
    title: 'Urban Echoes',
    artist: 'City Frequencies',
    duration: 195,
    audioUrl: '/assets/audio/sample-track-3.mp3'
  }
];

export function getTrackById(id: TrackId): Track | undefined {
  return TRACKS.find(track => track.id === id);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
