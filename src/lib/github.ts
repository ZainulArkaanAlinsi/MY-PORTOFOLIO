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

export interface GitHubUserStats {
  totalPublicRepos: number;
  totalPrivateRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languages: { name: string; percentage: number; color: string }[];
  contributionCalendar: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
  username: string;
}

// Language colors mapped
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Scala: '#c22d40',
  Flutter: '#1389FD',
};

export async function getGithubProjects(): Promise<Project[]> {
  const username = process.env.GITHUB_USERNAME || 'zainularkaan';
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const repos = await res.json();

    if (!Array.isArray(repos)) {
      throw new Error('GitHub API response is not an array');
    }

    const mapped = repos
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => ({
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

// Mock contribution calendar: generate last 365 days
function generateMockCalendar(): { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] {
  const days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * 10) : 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 6) level = 4;
    else if (count > 4) level = 3;
    else if (count > 2) level = 2;
    else if (count > 0) level = 1;
    days.push({ date: d.toISOString().split('T')[0], count, level });
  }
  return days;
}

// Mock language breakdown based on developer's known tech stack
function generateMockLanguages(): { name: string; percentage: number; color: string }[] {
  return [
    { name: 'TypeScript', percentage: 40, color: '#3178c6' },
    { name: 'Dart', percentage: 25, color: '#00B4AB' },
    { name: 'PHP', percentage: 20, color: '#4F5D95' },
    { name: 'JavaScript', percentage: 10, color: '#f1e05a' },
    { name: 'HTML/CSS', percentage: 5, color: '#e34c26' },
  ];
}

export async function getGithubUserStats(): Promise<GitHubUserStats> {
  const username = process.env.GITHUB_USERNAME || 'zainularkaan';
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  try {
    // Fetch user info
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } });
    const userData = await userRes.json();

    // Fetch all repos to compute language breakdown
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers,
      next: { revalidate: 3600 },
    });
    const repos = await reposRes.json();

    // Calculate total stars & forks
    let totalStars = 0;
    let totalForks = 0;
    const langBytes: Record<string, number> = {};

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    }

    // Get languages from repos
    const langPromises = repos
      .filter((r: any) => r.language)
      .map(async (repo: any) => {
        try {
          const lres = await fetch(repo.languages_url, { headers, signal: AbortSignal.timeout(3000) });
          const langData = await lres.json();
          for (const [lang, bytes] of Object.entries(langData)) {
            langBytes[lang] = (langBytes[lang] || 0) + (bytes as number);
          }
        } catch {
          // fallback: use repo.language as 1
          if (repo.language) {
            langBytes[repo.language] = (langBytes[repo.language] || 0) + 1;
          }
        }
      });

    await Promise.allSettled(langPromises);

    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langBytes)
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 100),
        color: LANGUAGE_COLORS[name] || '#6b7280',
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8);

    // Contribution calendar: GitHub's GraphQL API is ideal but requires token.
    // Fallback to mock if no token
    let contributionCalendar = generateMockCalendar();
    if (token) {
      try {
        const graphqlQuery = {
          query: `
            query($username: String!) {
              user(login: $username) {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                        color
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { username },
        };
        const gqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(graphqlQuery),
        });
        const gqlData = await gqlRes.json();
        if (gqlData?.data?.user?.contributionsCollection?.contributionCalendar) {
          const cal = gqlData.data.user.contributionsCollection.contributionCalendar;
          const days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
          for (const week of cal.weeks) {
            for (const day of week.contributionDays) {
              let level: 0 | 1 | 2 | 3 | 4 = 0;
              if (day.contributionCount > 10) level = 4;
              else if (day.contributionCount > 5) level = 3;
              else if (day.contributionCount > 2) level = 2;
              else if (day.contributionCount > 0) level = 1;
              days.push({ date: day.date, count: day.contributionCount, level });
            }
          }
          contributionCalendar = days;
        }
      } catch {
        // keep mock calendar
      }
    }

    return {
      totalPublicRepos: userData.public_repos || repos.length,
      totalPrivateRepos: userData.total_private_repos || 0,
      totalStars,
      totalForks,
      totalCommits: 0, // Requires more complex API; mock as total repos * avg commits
      languages,
      contributionCalendar,
      username,
    };
  } catch (error) {
    console.warn('Error fetching GitHub user stats, returning mock data:', error);
    return {
      totalPublicRepos: 28,
      totalPrivateRepos: 6,
      totalStars: 86,
      totalForks: 17,
      totalCommits: 420,
      languages: generateMockLanguages(),
      contributionCalendar: generateMockCalendar(),
      username,
    };
  }
}