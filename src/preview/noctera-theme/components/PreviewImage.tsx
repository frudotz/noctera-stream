import type { Picture } from "../../../data";

type Props = {
  picture: Picture;
  /** "" for purely decorative copies (the blurred atmosphere behind the cover). */
  alt: string;
  /** Rendered width of the image in this layout, so the browser picks the right file. */
  sizes: string;
  /** The featured cover is the page's main image; everything else loads lazily. */
  priority?: boolean;
  className?: string;
};

/**
 * Same file set as the production ResponsiveImage (original + -640/-1200 copies),
 * but with sizes and loading tuned to each slot of the preview layout.
 */
export function PreviewImage({ picture, alt, sizes, priority = false, className }: Props) {
  const srcSet = [...(picture.variants ?? []), picture]
    .map(({ src, width }) => `${src} ${width}w`)
    .join(", ");

  return (
    <img
      className={className}
      src={picture.src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={picture.width}
      height={picture.height ?? picture.width}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
    />
  );
}
