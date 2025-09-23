import { siteConfig } from "@/lib/site-config";

const getOEmbedUrl = (format: "json" | "xml") =>
  new URL(`/api/oembed?format=${format}`, siteConfig.url).toString();

export default function Head() {
  return (
    <>
      <link rel="alternate" type="application/json+oembed" href={getOEmbedUrl("json")} />
      <link rel="alternate" type="text/xml+oembed" href={getOEmbedUrl("xml")} />
    </>
  );
}
