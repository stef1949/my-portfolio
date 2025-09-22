import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const html = `<iframe src="${siteConfig.url}" width="${siteConfig.embed.width}" height="${siteConfig.embed.height}" style="border:0;max-width:100%;" title="${siteConfig.title}" allowfullscreen></iframe>`;

  return NextResponse.json({
    version: "1.0",
    type: "rich",
    provider_name: siteConfig.siteName,
    provider_url: siteConfig.url,
    title: siteConfig.title,
    author_name: siteConfig.authorName,
    author_url: `${siteConfig.url}#about`,
    width: siteConfig.embed.width,
    height: siteConfig.embed.height,
    html,
    thumbnail_url: new URL(siteConfig.ogImage.path, siteConfig.url).toString(),
    thumbnail_width: siteConfig.ogImage.width,
    thumbnail_height: siteConfig.ogImage.height,
    cache_age: 3600,
  });
}
