import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { RouteData, SiteData } from "@/lib/types";
import { getAllRoutes, getRouteData, getSiteData } from "@/lib/layout-service";
import { Placeholder } from "@/components/Placeholder";

interface CmsPageProps {
  layout: RouteData;
  site: SiteData;
}

/**
 * Single optional-catch-all route that renders EVERY page of the site.
 * Pages are not code: the layout service returns the composition for a
 * route and the Placeholder/registry pair renders it. Adding a page (or
 * a whole new subsidiary site) is a content operation, not a deployment.
 */
export default function CmsPage({ layout }: CmsPageProps) {
  return (
    <>
      <Head>
        <title>{layout.meta.title}</title>
        <meta name="description" content={layout.meta.description} />
      </Head>
      <main>
        <Placeholder name="main" placeholders={layout.placeholders} />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllRoutes().map((route) => ({
    params: {
      path: route.route === "/" ? [] : route.route.replace(/^\//, "").split("/"),
    },
  })),
  // Unknown routes 404 at build time. With a live CMS this would be
  // "blocking" + ISR so editors can publish new pages without a build.
  fallback: false,
});

export const getStaticProps: GetStaticProps<CmsPageProps> = async ({ params }) => {
  const segments = (params?.path as string[] | undefined) ?? [];
  const route = "/" + segments.join("/");
  const layout = getRouteData(route);
  if (!layout) return { notFound: true };
  return { props: { layout, site: getSiteData() } };
};
