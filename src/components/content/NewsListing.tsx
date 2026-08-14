import { useMemo, useState } from "react";
import type {
  TextField,
  DateField,
  ImageField,
  LinkField,
} from "@/lib/types";
import type { RenderingProps } from "../registry";
import { Text } from "../fields/Text";
import { Image } from "../fields/Image";
import { Link } from "../fields/Link";
import { useDictionary, useLocale } from "@/lib/site-context";

interface NewsItem {
  title?: TextField;
  excerpt?: TextField;
  image?: ImageField;
  category?: TextField;
  /** Badge color key — editors pick a tone, not a hex code. */
  categoryTone?: TextField;
  date?: DateField;
  link?: LinkField;
}

interface NewsListingFields {
  items?: NewsItem[];
}

const toneClasses: Record<string, string> = {
  dark: "bg-slate-800",
  blue: "bg-sky-500",
  brand: "bg-brand",
};

const columnClasses: Record<string, string> = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * News listing with client-side category filtering. The filter chips are
 * derived from the categories present in the content — adding a third
 * category in the CMS adds a chip, with no code change. Column count is
 * a rendering parameter.
 */
export function NewsListing({ rendering }: RenderingProps) {
  const fields = (rendering.fields ?? {}) as NewsListingFields;
  const items = useMemo(() => fields.items ?? [], [fields.items]);
  const columns =
    columnClasses[rendering.params?.columns ?? "3"] ?? columnClasses["3"];

  const t = useDictionary();
  const locale = useLocale();
  const allLabel = t("news.all", "Tous");

  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const item of items) {
      const category = item.category?.value;
      if (category && !seen.includes(category)) seen.push(category);
    }
    return seen;
  }, [items]);

  const [active, setActive] = useState<string | null>(null);
  const visible = active
    ? items.filter((item) => item.category?.value === active)
    : items;

  return (
    <section className="py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {categories.length > 1 && (
          <div
            role="group"
            aria-label="Filtrer les actualités"
            className="flex flex-wrap gap-2 border-b border-slate-200 pb-6"
          >
            <FilterChip
              label={allLabel}
              pressed={active === null}
              onClick={() => setActive(null)}
            />
            {categories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                pressed={active === category}
                onClick={() => setActive(category)}
              />
            ))}
          </div>
        )}

        <p role="status" className="sr-only">
          {visible.length} {t("news.shown", "actualité(s) affichée(s)")}
        </p>

        <div className={`mt-8 grid grid-cols-1 gap-6 ${columns}`}>
          {visible.map((item, index) => (
            <NewsCard key={item.title?.value ?? index} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        pressed
          ? "bg-accent text-white shadow-sm"
          : "border border-slate-300 bg-white text-slate-700 hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}

function NewsCard({ item, locale }: { item: NewsItem; locale: string }) {
  const tone = toneClasses[item.categoryTone?.value ?? ""] ?? toneClasses.brand;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="relative aspect-video">
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from the CMS image field inside the renderer */}
        <Image
          field={item.image}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {item.category?.value && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${tone}`}
          >
            {item.category.value}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {item.date?.value && (
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            <time dateTime={item.date.value}>
              {formatDate(item.date.value, locale)}
            </time>
          </p>
        )}
        <Text
          field={item.title}
          tag="h3"
          className="mt-2 text-lg font-semibold leading-snug text-slate-900"
        />
        <Text
          field={item.excerpt}
          tag="p"
          className="mt-2 flex-1 text-sm leading-6 text-slate-600"
        />
        <Link
          field={item.link}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand transition hover:text-brand-dark"
        >
          {item.link?.value?.text}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/** "2026-03-15" -> "15 Mars 2026" (month capitalized to match the design). */
function formatDate(iso: string, locale: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  const formatted = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return formatted.replace(
    /\p{L}+/u,
    (month) => month.charAt(0).toUpperCase() + month.slice(1)
  );
}
