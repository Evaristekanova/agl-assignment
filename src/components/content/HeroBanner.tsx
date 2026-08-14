import type { TextField, LinkField } from "@/lib/types";
import type { RenderingProps } from "../registry";
import { Text } from "../fields/Text";
import { Link } from "../fields/Link";

interface HeroBannerFields {
  tag?: TextField;
  title?: TextField;
  subtitle?: TextField;
  cta?: LinkField;
}

/**
 * Page banner on the brand gradient. The `variant` rendering parameter
 * lets editors reuse the same component as a tall page header ("primary")
 * or a slim one ("compact") without a second implementation. The optional
 * `tag` field renders the small pill above the title.
 */
export function HeroBanner({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as HeroBannerFields;
  const variant = rendering.params?.variant ?? "primary";
  const isCompact = variant === "compact";

  return (
    <section
      className={`bg-linear-to-br from-grad-from to-grad-to text-white ${
        isCompact ? "py-12 sm:py-14" : "py-16 sm:py-24"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {fields.tag?.value && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium ring-1 ring-white/25">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 5h13a1 1 0 0 1 1 1v12a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5Z" />
              <path d="M18 20a2 2 0 0 0 2-2V9" />
              <path d="M8 9h5M8 13h5M8 17h5" />
            </svg>
            {fields.tag.value}
          </p>
        )}
        <Text
          field={fields.title}
          tag="h1"
          className={`font-bold tracking-tight ${
            isCompact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
          }`}
        />
        <Text
          field={fields.subtitle}
          tag="p"
          className={`mt-4 max-w-2xl font-light text-white/85 ${
            isCompact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
          }`}
        />
        {fields.cta?.value?.href && (
          <div className="mt-8">
            <Link
              field={fields.cta}
              className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-brand transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
            />
          </div>
        )}
      </div>
    </section>
  );
}
