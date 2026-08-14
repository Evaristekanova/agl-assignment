import type { PlaceholderMap } from "@/lib/types";
import { resolveComponent } from "./registry";

interface PlaceholderProps {
  /** Placeholder key to render, e.g. "main" or "section-content". */
  name: string;
  placeholders?: PlaceholderMap;
}

/**
 * Renders every component rendering the CMS placed in a named
 * placeholder, resolving each `componentName` through the registry.
 * Unknown components degrade gracefully: visible warning in development,
 * silently skipped in production — a content mistake must never take a
 * page down.
 */
export function Placeholder({ name, placeholders }: PlaceholderProps) {
  const renderings = placeholders?.[name] ?? [];
  return (
    <>
      {renderings.map((rendering) => {
        const Component = resolveComponent(rendering.componentName);
        if (!Component) {
          return (
            <MissingComponent
              key={rendering.uid}
              name={rendering.componentName}
            />
          );
        }
        return <Component key={rendering.uid} rendering={rendering} />;
      })}
    </>
  );
}

function MissingComponent({ name }: { name: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="mx-auto my-4 max-w-6xl rounded border border-dashed border-amber-400 bg-amber-50 p-4 text-sm text-amber-800">
      Unknown component <code className="font-mono font-semibold">{name}</code>{" "}
      — is it registered in <code className="font-mono">registry.ts</code>?
    </div>
  );
}
