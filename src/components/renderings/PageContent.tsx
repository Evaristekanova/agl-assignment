import type { RichTextField } from "@/types";
import type { RenderingProps } from "../registry";
import { RichText } from "../fields/RichText";

interface PageContentFields {
  content?: RichTextField;
}

/** Free-form editorial content block (sanitized CMS HTML). */
export function PageContent({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as PageContentFields;
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <RichText field={fields.content} className="max-w-3xl" />
    </div>
  );
}
