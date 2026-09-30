export type Url = string | null;

export type Image = {
  src: string;
  /** Pixel width of the file. */
  width: number;
};

export type Cover = Image & {
  /** Square artwork (original file) in /public. */
  src: string;
  /** Optional smaller copies of the same image; the browser picks the best fit for the screen. */
  variants?: Image[];
  /** JPEG copy used as the social-media preview (≈1200×1200). Falls back to `src`. */
  share?: Image;
};

export type StreamingPlatform =
  | "spotify"
  | "appleMusic"
  | "youtubeMusic"
  | "youtube"
  | "soundcloud"
  | "deezer"
  | "amazonMusic";

export type ArtistPlatform =
  | "instagram"
  | "spotify"
  | "appleMusic"
  | "youtube"
  | "soundcloud"
  | "tiktok"
  | "x";

export type Release = {
  /** URL segment: /releases/<slug>/ */
  slug: string;
  title: string;
  /** BCP 47 language of the title, so screen readers pronounce it correctly. */
  titleLang?: string;
  /** Artist slugs, in credit order. */
  artists: string[];
  /** How the artists are credited, e.g. "BOEM & RATH". Defaults to the names joined with " & ". */
  credit?: string;
  type: string;
  year: string;
  /** null shows the neutral placeholder. */
  cover: Cover | null;
  links: Record<StreamingPlatform, Url>;
  /** The release featured on the homepage. Exactly one release should set this. */
  latest?: boolean;
};

export type Artist = {
  /** URL segment: /artists/<slug>/ */
  slug: string;
  name: string;
  /** e.g. "Artist / Producer". Leave empty unless confirmed. */
  role: string;
  bio: string;
  /** Square portrait in /public. null = none. */
  image: Image | null;
  links: Record<ArtistPlatform, Url>;
};

export type SocialLink = {
  label: string;
  url: Url;
};
