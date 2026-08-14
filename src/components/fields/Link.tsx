import NextLink from "next/link";
import type { ReactNode } from "react";
import type { LinkField } from "@/types";

interface LinkProps {
  field?: LinkField;
  className?: string;
  children?: ReactNode;
}

/**
 * Renders a CMS link field. Internal links go through next/link for
 * client-side navigation; external links get rel="noopener noreferrer".
 */
export function Link({ field, className, children }: LinkProps) {
  const value = field?.value;
  if (!value?.href) return null;

  const isExternal = /^https?:\/\//i.test(value.href);
  if (isExternal) {
    return (
      <a
        href={value.href}
        target={value.target}
        rel="noopener noreferrer"
        className={className}
      >
        {children ?? value.text}
      </a>
    );
  }
  return (
    <NextLink href={value.href} className={className}>
      {children ?? value.text}
    </NextLink>
  );
}
