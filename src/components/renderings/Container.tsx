import { Placeholder } from "../Placeholder";
import type { RenderingProps } from "../registry";

const themes: Record<string, string> = {
  default: "bg-white",
  muted: "bg-slate-100",
  dark: "bg-ink text-white",
  brand: "bg-brand-soft",
  green: "bg-green-50",
};

/**
 * Container component demonstrating nested placeholders: editors can
 * drop any registered component into "container-content", and choose the
 * background via the `theme` rendering parameter — the same composition
 * model Sitecore SXA uses for page sections.
 */
export function Container({ rendering }: RenderingProps) {
  const theme = themes[rendering.params?.theme ?? "default"] ?? themes.default;
  return (
    <section className={theme}>
      <Placeholder
        name="container-content"
        placeholders={rendering.placeholders}
      />
    </section>
  );
}
