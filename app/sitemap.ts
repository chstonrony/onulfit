import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";

const BASE_URL = "https://onulfit.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // 글은 실제로 쓰거나 고친 날을 알려야 검색엔진이 수정일을 믿고 다시 읽어간다
  const articleDate = (a: (typeof ARTICLES)[number]) => new Date(a.updated ?? a.date);
  const latest = new Date(Math.max(...ARTICLES.map((a) => articleDate(a).getTime())));
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/self-check`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/guide`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    ...ARTICLES.map((a) => ({
      url: `${BASE_URL}/guide/${a.slug}`,
      lastModified: articleDate(a),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
