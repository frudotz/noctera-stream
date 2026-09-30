import type { Picture } from "../data";

type Props = {
  picture: Picture;
  alt: string;
};

/** The original image plus its smaller copies; the browser picks the smallest sharp-enough file. */
export function ResponsiveImage({ picture, alt }: Props) {
  const srcSet = [...(picture.variants ?? []), picture]
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
