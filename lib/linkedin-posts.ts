export type LinkedInPost = {
  title: string;
  date: string;
  blurb: string;
  href: string;
};

export type LinkedInPostResult = {
  posts: LinkedInPost[];
  source: "remote" | "fallback";
  message: string | null;
};

export const fallbackLinkedInPosts: LinkedInPost[] = [
  {
    title: "Deep dive: HarmonizeNN evaluation metrics",
    date: "Jan 2025",
    blurb:
      "Thread unpacking how kBET, iLISI, and silhouette scores guided my benchmarking of bulk RNA-seq batch correction models across clinical cohorts.",
    href: "https://www.linkedin.com/posts/stefan-ritchie_harmonizenn-an-open-source-neural-network-activity-7374443826096287744-c_JD",
  },
  {
    title: "Wearable prototyping tips from LumiFur",
    date: "Nov 2024",
    blurb:
      "Shared lessons on iterating embedded BLE wearables, from ESP-IDF DMA pitfalls to optimizing SwiftUI companion apps for latency.",
    href: "https://www.linkedin.com/posts/stefan-ritchie_github-stef1949lumifurcontroller-esp32-activity-7375910644212084737-uEul?utm_source=share&utm_medium=member_desktop&rcm=ACoAACYkcI8Bp09tnaAuJnXs7G0Nby93soyZdBo",
  },
  {
    title: "RNA-seq batch correction best practices",
    date: "Sep 2024",
    blurb:
      "Key takeaways from my MSc dissertation comparing ComBat, Limma, RUVSeq, SVA, and neural methods for harmonising multi-site datasets.",
    href: "https://www.linkedin.com/in/stefan-ritchie/recent-activity/all/",
  },
];

const normalizePost = (value: unknown): LinkedInPost | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const date = typeof record.date === "string" ? record.date.trim() : "";
  const blurb = typeof record.blurb === "string" ? record.blurb.trim() : "";
  const href = typeof record.href === "string" ? record.href.trim() : "";

  if (!title || !href) {
    return null;
  }

  return {
    title,
    date,
    blurb,
    href,
  };
};

export async function loadLinkedInPosts(): Promise<LinkedInPostResult> {
  const endpoint = process.env.LINKEDIN_POSTS_ENDPOINT;

  if (!endpoint) {
    return {
      posts: fallbackLinkedInPosts,
      source: "fallback",
      message: "LinkedIn feed is using local defaults. Configure LINKEDIN_POSTS_ENDPOINT to enable live syncing.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
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

    if (!posts.length) {
      throw new Error("LinkedIn source returned no valid posts");
    }

    return {
      posts,
      source: "remote",
      message: null,
    };
  } catch (error) {
    console.error("[LinkedIn] Failed to load remote posts", error);
    return {
      posts: fallbackLinkedInPosts,
      source: "fallback",
      message: "LinkedIn posts are temporarily unavailable; showing cached highlights instead.",
    };
  }
}
