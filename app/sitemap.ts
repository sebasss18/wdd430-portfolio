import type { MetadataRoute } from "next";

const siteUrl = "https://wdd430-portfolio-sable.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ];
}
