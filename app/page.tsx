import PortfolioContent from "./_components/portfolio-content";
import { loadLinkedInPosts } from "@/lib/linkedin-posts";

export const dynamic = "force-static";
export const revalidate = 600;

export default async function PortfolioPage() {
  const { posts, message } = await loadLinkedInPosts();

  return <PortfolioContent linkedinPosts={posts} linkedinMessage={message} />;
}
