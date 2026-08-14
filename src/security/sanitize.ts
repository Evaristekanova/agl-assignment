import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes CMS-authored HTML before it is rendered with
 * dangerouslySetInnerHTML. CMS content is semi-trusted: editors are
 * authenticated, but a compromised editor account (or a bug in the CMS)
 * must not become stored XSS on every site that renders the content.
 *
 * Allowlist approach: only structural/inline formatting tags survive.
 * No scripts, no event handlers, no javascript: URLs.
 */
export function sanitize(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "a",
      "br",
      "blockquote",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}
