import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

type SupportedFormat = "json" | "xml";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") ?? "json").toLowerCase() as SupportedFormat;
  const url = searchParams.get("url") ?? siteConfig.url;
  const maxWidthParam = searchParams.get("maxwidth");
  const maxHeightParam = searchParams.get("maxheight");

  const maxWidth = maxWidthParam ? Number.parseInt(maxWidthParam, 10) : siteConfig.embed.width;
  const maxHeight = maxHeightParam ? Number.parseInt(maxHeightParam, 10) : siteConfig.embed.height;

  if (format === "xml") {
    return new NextResponse("XML format is not supported. Use format=json.", {
      status: 501,
      headers: { "content-type": "text/plain" },
    });
  }

  if (!url.startsWith(siteConfig.url)) {
    return NextResponse.json(
      { error: "Requested URL is not embeddable." },
      { status: 400 }
    );
  }

  const iframeSrc = new URL("/", siteConfig.url);
  iframeSrc.searchParams.set("embedded", "true");

  const html = `<iframe src="${iframeSrc.toString()}" width="${maxWidth}" height="${maxHeight}" style="border:0;max-width:100%;" title="${siteConfig.title}" allowfullscreen></iframe>`;

  return NextResponse.json({
    version: "1.0",
    type: "rich",
    provider_name: siteConfig.siteName,
    provider_url: siteConfig.url,
    title: siteConfig.title,
    author_name: siteConfig.authorName,
    author_url: `${siteConfig.url}#about`,
    width: maxWidth,
    height: maxHeight,
    html,
    thumbnail_url: new URL(siteConfig.ogImage.path, siteConfig.url).toString(),
    thumbnail_width: siteConfig.ogImage.width,
    thumbnail_height: siteConfig.ogImage.height,
    cache_age: 3600,
  });
}
