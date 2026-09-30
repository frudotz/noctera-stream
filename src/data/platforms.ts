import type { ArtistPlatform, StreamingPlatform } from "./types";

/** Display order and names of the streaming platforms on release pages. */
export const streamingPlatforms: { key: StreamingPlatform; label: string }[] = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "youtubeMusic", label: "YouTube Music" },
  { key: "youtube", label: "YouTube" },
  { key: "soundcloud", label: "SoundCloud" },
  { key: "deezer", label: "Deezer" },
  { key: "amazonMusic", label: "Amazon Music" },
];

/** Display order and names of an artist's links. */
export const artistPlatforms: { key: ArtistPlatform; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "youtube", label: "YouTube" },
  { key: "soundcloud", label: "SoundCloud" },
  { key: "tiktok", label: "TikTok" },
  { key: "x", label: "X" },
];
