import type { CSSProperties, ReactNode } from "react";
import type { SiteData } from "@/types";
import { SiteProvider } from "@/context/site-context";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Site chrome. `site` comes from page props (loaded per-page by the
 * layout service); pages without it (e.g. the 404 page) render bare.
 *
 * The brand theme from site.json is injected here as CSS custom
 * properties, overriding the defaults in globals.css — re-branding for
 * another subsidiary is a content change, not a code change.
 */
export function Layout({ site, children }: { site?: SiteData; children: ReactNode }) {
  if (!site) return <>{children}</>;
  return (
    <SiteProvider site={site}>
      <div
        style={themeVariables(site.theme)}
        className="flex min-h-screen flex-col bg-white text-slate-900"
      >
        <Header site={site} />
        <div className="flex-1">{children}</div>
        <Footer site={site} />
      </div>
    </SiteProvider>
  );
}

/** { brandDark: "#…" } -> { "--brand-dark": "#…" } */
function themeVariables(theme: Record<string, string>): CSSProperties {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme ?? {})) {
    vars[`--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`] = value;
  }
  return vars as CSSProperties;
}
