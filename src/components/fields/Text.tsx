import type { ElementType } from "react";
import type { TextField } from "@/lib/types";

interface TextProps {
  field?: TextField;
  /** HTML tag to render, e.g. "h1", "p". Defaults to span. */
  tag?: ElementType;
  className?: string;
}

/**
 * Renders a single-line text field. Mirrors the JSS <Text /> field
 * component: components never read `.value` directly, they pass the
 * field to a renderer. Renders nothing when the editor left it empty.
 */
export function Text({ field, tag: Tag = "span", className }: TextProps) {
  if (!field?.value) return null;
  return <Tag className={className}>{field.value}</Tag>;
}
