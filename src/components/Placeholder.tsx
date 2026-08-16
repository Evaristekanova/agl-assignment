import { Component, type ReactNode } from "react";
import type { PlaceholderMap } from "@/types";
import { resolveComponent } from "./registry";

interface PlaceholderProps {
  /** Placeholder key to render, e.g. "main". */
  name: string;
  placeholders?: PlaceholderMap;
}

/**
 * Renders every component rendering the CMS placed in a named
 * placeholder, resolving each `componentName` through the registry.
 * Content mistakes degrade gracefully instead of taking the page down:
 * unknown component names AND components that throw at render both show
 * a visible warning in development and are silently skipped in
 * production.
 */
export function Placeholder({ name, placeholders }: PlaceholderProps) {
  const renderings = placeholders?.[name] ?? [];
  return (
    <>
      {renderings.map((rendering) => {
        const Rendered = resolveComponent(rendering.componentName);
        if (!Rendered) {
          return (
            <ComponentWarning key={rendering.uid} name={rendering.componentName}>
              Unknown component — is it registered in{" "}
              <code className="font-mono">registry.ts</code>?
            </ComponentWarning>
          );
        }
        return (
          <RenderingErrorBoundary
            key={rendering.uid}
            name={rendering.componentName}
          >
            <Rendered rendering={rendering} />
          </RenderingErrorBoundary>
        );
      })}
    </>
  );
}

/**
 * Catches render-time crashes inside a single rendering so one broken
 * component (e.g. malformed fields) never takes down the rest of the
 * page — the same guarantee the registry gives for unknown names.
 */
class RenderingErrorBoundary extends Component<
  { name: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <ComponentWarning name={this.props.name}>
          This component crashed while rendering — check its fields in the
          content JSON.
        </ComponentWarning>
      );
    }
    return this.props.children;
  }
}

function ComponentWarning({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="mx-auto my-4 max-w-6xl rounded border border-dashed border-amber-400 bg-amber-50 p-4 text-sm text-amber-800">
      <code className="font-mono font-semibold">{name}</code>: {children}
    </div>
  );
}
