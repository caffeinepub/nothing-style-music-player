import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type TrackId = Text;
  type Playlist = [TrackId];

  public type UserProfile = {
    name : Text;
  };

  public type PlaylistData = {
    tracks : [TrackId];
    isActive : Bool;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userPlaylists = Map.empty<Principal, Playlist>();
  let userFavorites = Map.empty<Principal, [TrackId]>();
  let userMultiplePlaylists = Map.empty<Principal, Map.Map<Text, PlaylistData>>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Favorites Management
  public shared ({ caller }) func saveFavorites(favorites : [TrackId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save favorites");
    };
    userFavorites.add(caller, favorites);
  };

  public query ({ caller }) func getFavorites() : async [TrackId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };
    switch (userFavorites.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites };
    };
  };

  // Playlist Management
  public shared ({ caller }) func savePlaylist(playlist : Playlist) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save playlists");
    };
    userPlaylists.add(caller, playlist);
  };

  // Multi-Playlist Management
  public shared ({ caller }) func savePlaylistByName(name : Text, tracks : [TrackId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save playlists");
    };

    let newPlaylist : PlaylistData = {
      tracks;
      isActive = isFirstPlaylist(caller);
    };

    let existingPlaylists = getPlaylistsWithDefaultMap(caller);
    existingPlaylists.add(name, newPlaylist);
    userMultiplePlaylists.add(caller, existingPlaylists);
  };

  public query ({ caller }) func getPlaylistByName(name : Text) : async [TrackId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access playlists");
    };

    switch (userMultiplePlaylists.get(caller)) {
      case (?playlists) {
        switch (playlists.get(name)) {
          case (?playlistData) { playlistData.tracks };
          case (null) { [] };
        };
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getActivePlaylist() : async [TrackId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access playlists");
    };

    switch (userMultiplePlaylists.get(caller)) {
      case (?playlists) {
        for ((_, playlistData) in playlists.entries()) {
          if (playlistData.isActive) { return playlistData.tracks };
        };
        [];
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func setActivePlaylist(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set active playlists");
    };

    let existingPlaylists = getPlaylistsWithDefaultMap(caller);

    for ((key, playlistData) in existingPlaylists.entries()) {
      if (Text.equal(key, name)) {
        existingPlaylists.add(key, { playlistData with isActive = true });
      } else {
        existingPlaylists.add(key, { playlistData with isActive = false });
      };
    };

    userMultiplePlaylists.add(caller, existingPlaylists);
  };

  public query ({ caller }) func getPlaylistNames() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access playlists");
    };

    switch (userMultiplePlaylists.get(caller)) {
      case (?playlists) { playlists.keys().toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deletePlaylist(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete playlists");
    };

    switch (userMultiplePlaylists.get(caller)) {
      case (?playlists) {
        playlists.remove(name);
        userMultiplePlaylists.add(caller, playlists);
      };
      case (null) { () };
    };
  };

  public query ({ caller }) func getPlaylist() : async [TrackId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access playlists");
    };
    switch (userPlaylists.get(caller)) {
      case (null) { [] };
      case (?playlist) { playlist };
    };
  };

  func isFirstPlaylist(caller : Principal) : Bool {
    switch (userMultiplePlaylists.get(caller)) {
      case (null) { true };
      case (?playlists) { playlists.size() == 0 };
    };
  };

  func getPlaylistsWithDefaultMap(caller : Principal) : Map.Map<Text, PlaylistData> {
    switch (userMultiplePlaylists.get(caller)) {
      case (null) { Map.empty<Text, PlaylistData>() };
      case (?playlists) { playlists };
    };
  };
};
