import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { Layout } from "@/components/layout/Layout";
import type { SiteData } from "@/types";

// Self-hosted via next/font: no request to Google at runtime (no CSP
// exception, no user IP shared with a third party).
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }: AppProps) {
  const site = (pageProps as { site?: SiteData }).site;
  return (
    <div className={`${poppins.variable} font-sans`}>
      <Layout site={site}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
