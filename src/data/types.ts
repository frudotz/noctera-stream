export type Url = string | null;

export type Image = {
  src: string;
  /** Pixel width of the file. */
  width: number;
  /** Pixel height; omit for square images. */
  height?: number;
};

/** An original image in /public plus optional smaller copies of the same picture. */
export type Picture = Image & {
  /** Smaller copies of the same image; the browser picks the best fit for the screen. */
  variants?: Image[];
  /** JPEG copy used as the social-media preview (≈1200 px). Falls back to `src`. */
  share?: Image;
};

/** Square release artwork. */
export type Cover = Picture;

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
  /** Other roster members who worked on the release (not part of the credit line). */
  contributors?: { artist: string; role: string }[];
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
  /** Legal name, shown under the artist name. */
  realName: string;
  /** e.g. "Artist / Producer". Leave empty unless confirmed. */
  role: string;
  /** Biography paragraphs, exactly as supplied. */
  bio: string[];
  /** One or two sentences for search results and link previews (≈140–160 characters), based only on the biography. */
  summary: string;
  /** BCP 47 language of the biography and legal name. */
  bioLang?: string;
  /** Profile photo in /public. null = none. */
  image: (Picture & { alt: string }) | null;
  /** One URL per platform, or a list when the artist has several accounts there. */
  links: Record<ArtistPlatform, Url | string[]>;
};

export type SocialLink = {
  label: string;
  url: Url;
  /** Account handle, shown when an artist has several accounts on one platform. */
  handle?: string;
};
