import { useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/router";
import type { SiteData } from "@/types";
import { useDictionary } from "@/context/site-context";
import { Menu, X } from "lucide-react";

/**
 * Site header driven by site.json content: logo, nav items and menu
 * labels are all content. Responsive: inline nav on desktop (with the
 * brand underline on the active page), accessible toggle menu below lg.
 */
export function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false);
  const { asPath } = useRouter();
  const t = useDictionary();

  const isActive = (href: string) => href !== "#" && asPath === href;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NextLink href="/" className="flex items-center gap-2">
          <NextImage
            src={site.logo.src}
            alt=""
            width={site.logo.width ?? 40}
            height={site.logo.height ?? 40}
            priority
          />
          <span className="sr-only">{site.name}</span>
        </NextLink>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {site.nav.map((item) => (
              <li key={item.text}>
                <NextLink
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`border-b-2 pb-1 text-sm font-medium transition hover:text-brand ${
                    isActive(item.href)
                      ? "border-brand text-slate-900"
                      : "border-transparent text-slate-600"
                  }`}
                >
                  {item.text}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={
            open
              ? t("nav.close", "Fermer le menu")
              : t("nav.open", "Ouvrir le menu")
          }
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navigation principale"
          className="border-t border-slate-100 lg:hidden absolute inset-x-0 top-16 bg-white shadow-lg z-20"
        >
          <ul className="space-y-1 px-4 py-3">
            {site.nav.map((item) => (
              <li key={item.text}>
                <NextLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-2 font-medium ${
                    isActive(item.href)
                      ? "bg-brand-soft text-brand"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.text}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
