export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.richies.uk",
  title: "Steph Ritchie • Computational Biologist & Maker",
  description:
    "Bioinformatics engineer delivering neural network batch correction, GPU visualisations, and wearable microcontrollers.",
  siteName: "Steph Ritchie Portfolio",
  authorName: "Stephie Ritchie",
  authorTwitter: "@stephieritchie",
  embed: {
    width: 800,
    height: 450,
  },
  ogImage: {
    path: "/social-card.png",
    width: 2400,
    height: 1260,
    alt: "Steph Ritchie portfolio preview",
  },
};
