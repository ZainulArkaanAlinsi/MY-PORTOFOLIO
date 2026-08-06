import { getGithubProjects } from "@/lib/github";
import ImmersivePortfolio from "@/components/immersive/ImmersivePortfolio";

// ISR. This page used `force-dynamic`, so every single visitor waited on a
// GitHub API round-trip before any HTML was streamed — a cold hit measured
// ~6.8s to become usable versus ~2.8s warm. The page is now generated once and
// refreshed in the background every hour: visitors always get cached HTML
// instantly, and GITHUB_TOKEN is still read server-side during regeneration.
export const revalidate = 3600;

export default async function Home() {
  const projects = await getGithubProjects();

  return <ImmersivePortfolio projects={projects} />;
}
