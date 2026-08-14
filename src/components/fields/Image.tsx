import NextImage from "next/image";
import type { ImageField } from "@/lib/types";

interface ImageProps {
  field?: ImageField;
  className?: string;
  /** Fill the parent element (parent must be position:relative). */
  fill?: boolean;
  sizes?: string;
}

/** Renders a CMS image field through next/image for optimization. */
export function Image({ field, className, fill, sizes }: ImageProps) {
  const value = field?.value;
  if (!value?.src) return null;
  if (fill) {
    return (
      <NextImage
        src={value.src}
        alt={value.alt ?? ""}
        fill
        sizes={sizes}
        className={className}
      />
    );
  }
  return (
    <NextImage
      src={value.src}
      alt={value.alt ?? ""}
      width={value.width ?? 48}
      height={value.height ?? 48}
      className={className}
    />
  );
}
