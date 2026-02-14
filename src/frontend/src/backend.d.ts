import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type TrackId = string;
export interface UserProfile {
    name: string;
}
export type Playlist = Array<TrackId>;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePlaylist(name: string): Promise<void>;
    getActivePlaylist(): Promise<Array<TrackId>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<TrackId>>;
    getPlaylist(): Promise<Array<TrackId>>;
    getPlaylistByName(name: string): Promise<Array<TrackId>>;
    getPlaylistNames(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFavorites(favorites: Array<TrackId>): Promise<void>;
    savePlaylist(playlist: Playlist): Promise<void>;
    savePlaylistByName(name: string, tracks: Array<TrackId>): Promise<void>;
    setActivePlaylist(name: string): Promise<void>;
}
