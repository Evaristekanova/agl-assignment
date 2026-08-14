import fs from "fs";
import path from "path";
import type { RouteData, SiteData } from "@/types";

/**
 * Mock Layout Service.
 *
 * Stands in for the Sitecore Layout Service / GraphQL Edge endpoint: given a
 * route, it returns the page layout (placeholders + component renderings +
 * fields) as data. In production this module is the only place that would
 * change — swap the filesystem read for an HTTP call to Sitecore and the
 * rest of the app keeps working.
 *
 * Server-side only (uses `fs`); called from getStaticProps / getStaticPaths.
 */

const contentDir = path.join(process.cwd(), "src", "content");
const routesDir = path.join(contentDir, "routes");

export function getSiteData(): SiteData {
  const raw = fs.readFileSync(path.join(contentDir, "site.json"), "utf-8");
  return JSON.parse(raw) as SiteData;
}

export function getAllRoutes(): RouteData[] {
  return fs
    .readdirSync(routesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(routesDir, file), "utf-8");
      return JSON.parse(raw) as RouteData;
    });
}

export function getRouteData(route: string): RouteData | null {
  return getAllRoutes().find((r) => r.route === route) ?? null;
}
