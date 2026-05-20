import { getGithubProjects, getGithubUserStats } from "@/lib/github";
import PortfolioClient from "@/components/PortfolioClient";

// Force dynamic execution to allow secure GITHUB_TOKEN runtime fetching and fallback logic
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getGithubProjects();
  const githubStats = await getGithubUserStats();

  return <PortfolioClient initialProjects={projects} initialGitHubStats={githubStats} />;
}