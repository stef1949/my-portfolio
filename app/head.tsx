import { siteConfig } from "@/lib/site-config";

export default function Head() {
  const oembedUrl = `${siteConfig.url.replace(/\/$/, "")}/api/oembed?format=json`;
  return (
    <>
      <link rel="alternate" type="application/json+oembed" href={oembedUrl} />
      <link rel="alternate" type="text/xml+oembed" href={`${oembedUrl}`.replace("format=json", "format=xml")} />
    </>
  );
}
