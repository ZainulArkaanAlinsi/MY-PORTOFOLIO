import { getGithubProjects } from "@/lib/github";
import ImmersivePortfolio from "@/components/immersive/ImmersivePortfolio";

// Force dynamic execution to allow secure GITHUB_TOKEN runtime fetching and fallback logic
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getGithubProjects();

  return <ImmersivePortfolio projects={projects} />;
}
