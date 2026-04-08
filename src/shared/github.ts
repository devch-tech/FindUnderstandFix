import type {
  Issue,
  IssueDetail,
  IssueComment,
  RepoInfo,
  SearchParams,
  GitHubSearchResponse,
  GitHubIssueRaw,
  GitHubRepoRaw,
  GitHubCommentRaw,
} from "./types.js";
import { LANGUAGE_QUERY_MAP, normalizeLanguage, SUPPORTED_LANGUAGES_LIST } from "./constants.js";
import { cacheGet, cacheSet, cacheKey } from "./cache.js";

const GITHUB_API = "https://api.github.com";
const SEARCH_CACHE_TTL = 15 * 60; // 15 minutes
const DETAIL_CACHE_TTL = 30 * 60; // 30 minutes

function getHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "❌ FindUnderstandFix requires a valid GITHUB_TOKEN to work.\n\n" +
      "1. Go to https://github.com/settings/tokens → \"Generate new token (classic)\"\n" +
      "2. Select scope: public_repo (read-only is enough)\n" +
      "3. Copy the token and add it to your MCP config or .env file"
    );
  }
  return {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "FindUnderstandFix/1.0",
    "Authorization": `Bearer ${token}`,
  };
}

async function githubFetch(url: string): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, { headers: getHeaders() });
  } catch {
    throw new Error("Could not connect to GitHub. Check your internet connection.");
  }

  const remaining = parseInt(response.headers.get("X-RateLimit-Remaining") ?? "1");
  const resetAt = parseInt(response.headers.get("X-RateLimit-Reset") ?? "0");

  if (remaining === 0) {
    const waitSeconds = resetAt - Math.floor(Date.now() / 1000);
    throw new Error(`GitHub rate limit reached. Resets in ${waitSeconds} seconds.`);
  }

  if (response.status === 401) {
    throw new Error(
      "❌ FindUnderstandFix requires a valid GITHUB_TOKEN to work.\n\n" +
      "1. Go to https://github.com/settings/tokens → \"Generate new token (classic)\"\n" +
      "2. Select scope: public_repo (read-only is enough)\n" +
      "3. Copy the token and add it to your MCP config or .env file"
    );
  }

  if (response.status === 404) {
    throw new Error("Issue not found. Check that the URL is correct.");
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response;
}

export async function validateToken(): Promise<void> {
  await githubFetch(`${GITHUB_API}/user`);
}

function buildQuery(params: SearchParams): string {
  const normalizedLang = normalizeLanguage(params.language);
  if (!normalizedLang) {
    throw new Error(
      `'${params.language}' is not supported. Available languages: ${SUPPORTED_LANGUAGES_LIST}`
    );
  }

  const githubLang = LANGUAGE_QUERY_MAP[normalizedLang];
  const parts = [
    `language:${githubLang}`,
    "is:open",
    "is:issue",
  ];

  if (params.difficulty === "beginner") parts.push('label:"good first issue"');
  if (params.difficulty === "intermediate") parts.push('label:"help wanted"');
  if (params.type === "bug") parts.push("label:bug");
  if (params.type === "feature") parts.push("label:enhancement");

  return parts.join("+");
}

function transformIssue(raw: GitHubIssueRaw, repoStars: number, repoLanguage: string | null): Issue {
  const repoUrl = raw.repository_url.replace("https://api.github.com/repos/", "https://github.com/");
  const repoFullName = raw.repository_url.replace("https://api.github.com/repos/", "");

  return {
    id: raw.id,
    number: raw.number,
    title: raw.title,
    url: raw.html_url,
    repoFullName,
    repoUrl,
    repoStars,
    repoLanguage,
    labels: raw.labels.map((l) => l.name),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    author: raw.user.login,
    body: raw.body,
    commentsCount: raw.comments,
    state: raw.state,
  };
}

export async function searchIssues(params: SearchParams): Promise<Issue[]> {
  const key = cacheKey("search", params.language, params.difficulty, params.type, params.limit);
  const cached = cacheGet<Issue[]>(key);
  if (cached) return cached;

  const query = buildQuery(params);
  const url = `${GITHUB_API}/search/issues?q=${query}&sort=created&order=desc&per_page=${params.limit}`;

  const response = await githubFetch(url);
  const data = (await response.json()) as GitHubSearchResponse;

  // Fetch repo info for stars/language in parallel (up to first 5 to avoid rate limits)
  const repoUrls = [...new Set(data.items.map((i) => i.repository_url))].slice(0, 5);
  const repoMap = new Map<string, { stars: number; language: string | null }>();

  await Promise.all(
    repoUrls.map(async (repoUrl) => {
      try {
        const r = await githubFetch(repoUrl);
        const repo = (await r.json()) as GitHubRepoRaw;
        repoMap.set(repoUrl, { stars: repo.stargazers_count, language: repo.language });
      } catch {
        repoMap.set(repoUrl, { stars: 0, language: null });
      }
    })
  );

  const issues = data.items.map((raw) => {
    const repoInfo = repoMap.get(raw.repository_url) ?? { stars: 0, language: null };
    return transformIssue(raw, repoInfo.stars, repoInfo.language);
  });

  cacheSet(key, issues, SEARCH_CACHE_TTL);
  return issues;
}

export function parseIssueUrl(url: string): { owner: string; repo: string; number: number } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) {
    throw new Error(`Invalid GitHub issue URL: ${url}`);
  }
  return { owner: match[1], repo: match[2], number: parseInt(match[3]) };
}

export async function getIssueDetail(issueUrl: string): Promise<IssueDetail> {
  const key = cacheKey("detail", issueUrl);
  const cached = cacheGet<IssueDetail>(key);
  if (cached) return cached;

  const { owner, repo, number } = parseIssueUrl(issueUrl);

  const [issueRes, commentsRes, repoRes] = await Promise.all([
    githubFetch(`${GITHUB_API}/repos/${owner}/${repo}/issues/${number}`),
    githubFetch(`${GITHUB_API}/repos/${owner}/${repo}/issues/${number}/comments?per_page=5`),
    githubFetch(`${GITHUB_API}/repos/${owner}/${repo}`),
  ]);

  const rawIssue = (await issueRes.json()) as GitHubIssueRaw;
  const rawComments = (await commentsRes.json()) as GitHubCommentRaw[];
  const rawRepo = (await repoRes.json()) as GitHubRepoRaw;

  // Check for CONTRIBUTING.md
  let contributingUrl: string | null = null;
  let hasContributing = false;
  try {
    const contribRes = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/CONTRIBUTING.md`,
      { headers: getHeaders() }
    );
    if (contribRes.ok) {
      hasContributing = true;
      contributingUrl = `https://github.com/${owner}/${repo}/blob/${rawRepo.default_branch}/CONTRIBUTING.md`;
    }
  } catch {
    // No contributing guide
  }

  const repoInfo: RepoInfo = {
    fullName: rawRepo.full_name,
    url: `https://github.com/${rawRepo.full_name}`,
    cloneUrl: rawRepo.clone_url,
    defaultBranch: rawRepo.default_branch,
    stars: rawRepo.stargazers_count,
    language: rawRepo.language,
    description: rawRepo.description,
    contributingUrl,
    hasContributing,
  };

  const comments: IssueComment[] = rawComments.slice(0, 3).map((c) => ({
    author: c.user.login,
    body: c.body,
    createdAt: c.created_at,
  }));

  const issue = transformIssue(rawIssue, rawRepo.stargazers_count, rawRepo.language);
  const detail: IssueDetail = { ...issue, repo: repoInfo, comments };

  cacheSet(key, detail, DETAIL_CACHE_TTL);
  return detail;
}
