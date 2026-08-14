import type { ComponentType } from "react";
import type { ComponentRendering } from "@/types";
import { HeroBanner } from "./renderings/HeroBanner";
import { NewsListing } from "./renderings/NewsListing";
import { NewsletterSignup } from "./renderings/NewsletterSignup";
import { Container } from "./renderings/Container";
import { PageContent } from "./renderings/PageContent";
import { ContactForm } from "./renderings/ContactForm";

/** Every registered component receives its rendering (fields + params + nested placeholders). */
export interface RenderingProps {
  rendering: ComponentRendering;
}

/**
 * Component registry (factory).
 *
 * Maps the `componentName` strings coming from the layout service to
 * React implementations — the same mechanism as the JSS component
 * factory. The registry key, component name and file name are always
 * identical, so the CMS-to-code mapping is self-evident. Registering a
 * component here is all that is needed to make it available to editors.
 */
const registry: Record<string, ComponentType<RenderingProps>> = {
  HeroBanner,
  NewsListing,
  NewsletterSignup,
  Container,
  PageContent,
  ContactForm,
};

export function resolveComponent(
  name: string,
): ComponentType<RenderingProps> | null {
  return registry[name] ?? null;
}
