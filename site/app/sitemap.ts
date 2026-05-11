import type { MetadataRoute } from "next";

const BASE_URL = "https://www.for-your-wedding-day.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`,                lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/pricing`,         lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/book`,            lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/founding-couple`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/legal/tokushoho`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`,   lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/legal/terms`,     lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
