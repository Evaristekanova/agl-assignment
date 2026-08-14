/**
 * Content model types.
 *
 * These deliberately mirror the shape of the Sitecore Layout Service
 * response (routes -> placeholders -> component renderings -> fields),
 * so the app can later be pointed at a real Sitecore instance with
 * minimal changes.
 */

/** Simple single-line text field. */
export interface TextField {
  value: string;
}

/** HTML field authored in the CMS rich-text editor. Must be sanitized before rendering. */
export interface RichTextField {
  value: string;
}

export interface ImageField {
  value: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export interface LinkField {
  value: {
    href: string;
    text: string;
    target?: "_blank";
  };
}

/** ISO date string authored in the CMS, formatted at render time per site locale. */
export interface DateField {
  value: string;
}

/**
 * One component instance placed on a page by a content editor.
 * `componentName` is resolved against the component registry at render time.
 * `params` are rendering parameters (presentation options, always strings).
 * `placeholders` allows container components to nest further renderings.
 */
export interface ComponentRendering {
  uid: string;
  componentName: string;
  params?: Record<string, string>;
  fields?: Record<string, unknown>;
  placeholders?: PlaceholderMap;
}

export type PlaceholderMap = Record<string, ComponentRendering[]>;

/** The layout of a single route, as returned by the (mock) layout service. */
export interface RouteData {
  route: string;
  name: string;
  meta: {
    title: string;
    description: string;
  };
  placeholders: PlaceholderMap;
}

export interface NavItem {
  href: string;
  text: string;
}

/**
 * Site-level content shared across pages: header/footer chrome, brand
 * theme tokens and the phrase dictionary. One file per subsidiary site —
 * swapping it re-brands the whole app without touching a component.
 */
export interface SiteData {
  name: string;
  tagline: string;
  /** BCP 47 locale used for date formatting and the <html lang> value. */
  locale: string;
  logo: ImageField["value"];
  /** Brand tokens injected as CSS custom properties (see Layout). */
  theme: Record<string, string>;
  /** UI phrases, mirroring the Sitecore dictionary service. */
  dictionary: Record<string, string>;
  nav: NavItem[];
  footer: {
    columns: { title: string; links: NavItem[] }[];
    contact: { title: string; address: string; phone: string; email: string };
    legal: string;
  };
}
