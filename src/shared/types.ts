export type SupportedLang = "en" | "es" | "pt" | "it";

export interface Issue {
  id: number;
  number: number;
  title: string;
  url: string;
  repoFullName: string;
  repoUrl: string;
  repoStars: number;
  repoLanguage: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  body: string | null;
  commentsCount: number;
  state: string;
}

export interface IssueComment {
  author: string;
  body: string;
  createdAt: string;
}

export interface RepoInfo {
  fullName: string;
  url: string;
  cloneUrl: string;
  defaultBranch: string;
  stars: number;
  language: string | null;
  description: string | null;
  contributingUrl: string | null;
  hasContributing: boolean;
}

export interface IssueDetail extends Issue {
  repo: RepoInfo;
  comments: IssueComment[];
}

export interface SearchParams {
  language: string;
  difficulty: "any" | "beginner" | "intermediate" | "advanced";
  type: "bug" | "feature" | "any";
  limit: number;
  lang: SupportedLang;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssueRaw[];
}

export interface GitHubIssueRaw {
  id: number;
  number: number;
  title: string;
  html_url: string;
  body: string | null;
  state: string;
  user: { login: string };
  labels: Array<{ name: string }>;
  created_at: string;
  updated_at: string;
  comments: number;
  repository_url: string;
}

export interface GitHubRepoRaw {
  full_name: string;
  html_url: string;
  clone_url: string;
  default_branch: string;
  stargazers_count: number;
  language: string | null;
  description: string | null;
}

export interface GitHubCommentRaw {
  user: { login: string };
  body: string;
  created_at: string;
}
