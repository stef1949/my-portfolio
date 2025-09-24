import { NextResponse } from "next/server";
import { fallbackLinkedInPosts, type LinkedInPost } from "@/lib/linkedin-posts";

export const revalidate = 600;
export const dynamic = "force-static";

const normalizePost = (value: unknown): LinkedInPost | null => {
  if (!value || typeof value !== "object") return null;
  const maybeRecord = value as Record<string, unknown>;
  const title = typeof maybeRecord.title === "string" ? maybeRecord.title.trim() : "";
  const date = typeof maybeRecord.date === "string" ? maybeRecord.date.trim() : "";
  const blurb = typeof maybeRecord.blurb === "string" ? maybeRecord.blurb.trim() : "";
  const href = typeof maybeRecord.href === "string" ? maybeRecord.href.trim() : "";
  if (!title || !href) return null;
  return {
    title,
    date,
    blurb,
    href,
  };
};

const FALLBACK_HEADERS = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
};

export async function GET(): Promise<Response> {
  const remoteSource = process.env.LINKEDIN_POSTS_ENDPOINT;

  if (!remoteSource) {
    return NextResponse.json(
      { posts: fallbackLinkedInPosts, source: "fallback", remoteConfigured: false },
      { headers: FALLBACK_HEADERS },
    );
  }

  try {
    const response = await fetch(remoteSource, {
      headers: {
        Accept: "application/json",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`LinkedIn source responded with ${response.status}`);
    }

    const payload = await response.json();
    const collection = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { posts?: unknown }).posts)
      ? (payload as { posts: unknown[] }).posts
      : [];

    const posts = collection
      .map(normalizePost)
      .filter((post): post is LinkedInPost => Boolean(post));

    if (posts.length === 0) {
      throw new Error("LinkedIn source returned no valid posts");
    }

    return NextResponse.json({ posts, source: "remote", remoteConfigured: true }, { headers: FALLBACK_HEADERS });
  } catch (error) {
    console.error("[LinkedIn] Failed to load remote posts", error);
    return NextResponse.json(
      { posts: fallbackLinkedInPosts, source: "fallback", remoteConfigured: true },
      { headers: FALLBACK_HEADERS },
    );
  }
}
