import type { Picture } from "../data";

type Props = {
  picture: Picture;
  alt: string;
};

/** The original image plus its smaller copies; the browser picks the smallest sharp-enough file. */
export function ResponsiveImage({ picture, alt }: Props) {
  // A variant as wide as the original (art smaller than 1200 px) replaces it: srcset widths must be unique.
  const srcSet = [...(picture.variants ?? []), picture]
    .filter((image, i, all) => all.findIndex((other) => other.width === image.width) === i)
    .map(({ src, width }) => `${src} ${width}w`)
    .join(", ");

  return (
    <img
      src={picture.src}
      srcSet={srcSet}
      sizes="(min-width: 820px) min(600px, 100svh - 190px), min(100vw - 40px, 544px)"
      alt={alt}
      width={picture.width}
      height={picture.height ?? picture.width}
      decoding="async"
      fetchPriority="high"
    />
  );
}
