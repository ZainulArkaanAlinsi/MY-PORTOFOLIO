export interface Project {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  htmlUrl: string;
  demoUrl?: string;
  topics: string[];
}

// The real account. Used as the default and as a rescue when a misconfigured
// GITHUB_USERNAME 404s — a wrong value in the environment used to silently
// downgrade the whole Work section to placeholder repos.
const DEFAULT_USERNAME = 'ZainulArkaanAlinsi';

export async function getGithubProjects(): Promise<Project[]> {
  const username = process.env.GITHUB_USERNAME || DEFAULT_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const fetchRepos = async (user: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    try {
      return await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=30`, {
        headers,
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    let res = await fetchRepos(username);

    if (res.status === 404 && username !== DEFAULT_USERNAME) {
      console.warn(
        `GITHUB_USERNAME="${username}" does not exist on GitHub — retrying with ${DEFAULT_USERNAME}.`
      );
      res = await fetchRepos(DEFAULT_USERNAME);
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const repos = await res.json();

    if (!Array.isArray(repos)) {
      throw new Error('GitHub API response is not an array');
    }

    const mapped = repos
      .filter((repo: { fork: boolean }) => !repo.fork)
      .map((repo: {
        id: number;
        name: string;
        description: string | null;
        language: string | null;
        stargazers_count: number;
        forks_count: number;
        html_url: string;
        homepage: string | null;
        topics: string[];
        fork: boolean;
      }) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description provided.',
        language: repo.language || 'TypeScript',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        htmlUrl: repo.html_url,
        demoUrl: repo.homepage || undefined,
        topics: repo.topics || [],
      }));

    return mapped.sort((a, b) => b.stars - a.stars);
  } catch (error) {
    console.warn('Error fetching GitHub projects, falling back to mock projects:', error);
    return [
      {
        id: 101,
        name: 'jne-attendance-mobile',
        description: 'Cross-platform mobile attendance tracking app built with Flutter. Integrates location tracking (geofencing) and biometric check-in with offline sync capabilities.',
        language: 'Dart',
        stars: 24,
        forks: 5,
        htmlUrl: `https://github.com/${username}/jne-attendance-mobile`,
        demoUrl: 'https://jne-attendance.web.app',
        topics: ['flutter', 'dart', 'geofencing', 'offline-sync', 'firebase']
      },
      {
        id: 102,
        name: 'jne-admin-dashboard',
        description: 'Next.js administrative command center for JNE Martapura. Includes real-time employee tracking, leave balances, automated overtime calculations, and Bento-grid layouts.',
        language: 'TypeScript',
        stars: 18,
        forks: 3,
        htmlUrl: `https://github.com/${username}/jne-admin-dashboard`,
        demoUrl: 'https://jne-admin.web.app',
        topics: ['nextjs', 'typescript', 'tailwind-css', 'firestore', 'charts']
      },
      {
        id: 103,
        name: 'payroll-attendance-management',
        description: 'Laravel and Livewire payroll module integrating time and attendance records to automate payslip generation, tax calculations, and attendance deductions.',
        language: 'PHP',
        stars: 12,
        forks: 2,
        htmlUrl: `https://github.com/${username}/payroll-attendance-management`,
        demoUrl: undefined,
        topics: ['laravel', 'php', 'livewire', 'payroll', 'mysql']
      },
      {
        id: 104,
        name: 'antigravity-ui-core',
        description: 'Premium glassmorphism and HSL-color CSS design component library tailored for React and Next.js projects.',
        language: 'TypeScript',
        stars: 32,
        forks: 7,
        htmlUrl: `https://github.com/${username}/antigravity-ui-core`,
        demoUrl: 'https://antigravity-ui.vercel.app',
        topics: ['react', 'nextjs', 'glassmorphism', 'design-system']
      }
    ];
  }
}
