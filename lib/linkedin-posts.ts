export type LinkedInPost = {
  title: string;
  date: string;
  blurb: string;
  href: string;
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
