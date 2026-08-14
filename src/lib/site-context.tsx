import { createContext, useContext, type ReactNode } from "react";
import type { SiteData } from "./types";

/**
 * Site context — the equivalent of the JSS SitecoreContext: gives any
 * component access to site-level data (locale, dictionary) without prop
 * drilling through the placeholder tree.
 */
const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({
  site,
  children,
}: {
  site?: SiteData;
  children: ReactNode;
}) {
  return (
    <SiteContext.Provider value={site ?? null}>{children}</SiteContext.Provider>
  );
}

export function useSite(): SiteData | null {
  return useContext(SiteContext);
}

/** Locale for date/number formatting; safe default when no site is loaded. */
export function useLocale(): string {
  return useSite()?.locale ?? "fr-FR";
}

/**
 * Dictionary lookup, mirroring the Sitecore dictionary service: UI
 * phrases ("Lire la suite", "Tous") are content, not code, so each
 * subsidiary site can translate them without a deployment.
 */
export function useDictionary(): (key: string, fallback: string) => string {
  const site = useSite();
  return (key, fallback) => site?.dictionary?.[key] ?? fallback;
}
