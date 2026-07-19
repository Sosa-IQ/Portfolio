import type { Metadata } from "next";

export const siteUrl = "https://www.jancarlossosa.com";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} — Jancarlos Sosa`,
      description,
      url: canonical,
      siteName: "Jancarlos Sosa",
      type: "website",
    },
  };
}
