import type { RichTextField } from "@/types";
import { sanitize } from "@/security/sanitize";

interface RichTextProps {
  field?: RichTextField;
  className?: string;
}

/**
 * Renders CMS-authored HTML. Always passes the value through the
 * sanitizer allowlist before dangerouslySetInnerHTML — CMS content is
 * data, not trusted markup.
 */
export function RichText({ field, className }: RichTextProps) {
  // Memoization is handled by the React Compiler (enabled in Next 16).
  const clean = field?.value ? sanitize(field.value) : "";
  if (!clean) return null;
  return (
    <div
      className={`rich-text ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
