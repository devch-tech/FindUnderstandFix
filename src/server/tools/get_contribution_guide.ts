import { z } from "zod";
import { getIssueDetail } from "../../shared/github.js";
import { t } from "../../shared/i18n.js";
import type { SupportedLang } from "../../shared/types.js";

export const getContributionGuideSchema = z.object({
  issue_url: z.string().url().describe("Full GitHub issue URL"),
  lang: z.enum(["en", "es", "pt", "it"]).default("en").describe("Response language"),
  git_username: z.string().optional().describe("Your GitHub username to personalize commands"),
});

export type GetContributionGuideInput = z.infer<typeof getContributionGuideSchema>;

export async function handleGetContributionGuide(input: GetContributionGuideInput): Promise<string> {
  const { issue_url, lang, git_username } = input;
  const uiLang = lang as SupportedLang;
  const username = git_username ?? "YOUR_USERNAME";

  const detail = await getIssueDetail(issue_url);
  const { repo, number, title } = detail;

  // Slugify title for branch name
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);

  const branchName = `fix/issue-${number}-${slug}`;
  const [owner, repoName] = repo.fullName.split("/");

  const stepLabel = (n: number, key: Parameters<typeof t>[1]) =>
    `${t(uiLang, "step")} ${n} — ${t(uiLang, key)}`;

  const lines: string[] = [
    `🚀 ${t(uiLang, "contributionGuide")} — ${repo.fullName}`,
    "",
    `${stepLabel(1, "fork")}`,
    `Go to: ${repo.url}`,
    `Click the "Fork" button (top right)`,
    `This creates a copy in your account: github.com/${username}/${repoName}`,
    "",
    `${stepLabel(2, "clone")}`,
    `git clone https://github.com/${username}/${repoName}.git`,
    `cd ${repoName}`,
    "",
    `${stepLabel(3, "configRemote")}`,
    `git remote add upstream ${repo.url}.git`,
    `git fetch upstream`,
    "",
    `${stepLabel(4, "createBranch")}`,
    `git checkout -b ${branchName}`,
    "",
    `${stepLabel(5, "installDeps")}`,
    `[Check the repository's README for setup instructions]`,
    "",
    `${stepLabel(6, "reproduce")}`,
    `Before fixing, confirm you can reproduce the issue.`,
    `Review the issue description for reproduction steps.`,
    "",
    `${stepLabel(7, "makeChanges")}`,
    `Work in the branch you created. Make small, focused commits:`,
    `git add .`,
    `git commit -m "fix: <description> (#${number})"`,
    "",
    `${stepLabel(8, "sync")}`,
    `git fetch upstream`,
    `git rebase upstream/${repo.defaultBranch}`,
    "",
    `${stepLabel(9, "push")}`,
    `git push origin ${branchName}`,
    "",
    `${stepLabel(10, "openPR")}`,
    `Go to: ${repo.url}/compare`,
    `Select your branch: ${branchName}`,
    `In the description, mention: "Fixes #${number}"`,
    `Follow the repo's PR template if it exists.`,
  ];

  if (repo.contributingUrl) {
    lines.push("", `📖 ${t(uiLang, "officialGuide")}:`, repo.contributingUrl);
  }

  // owner is used for the fork step context — suppress unused warning
  void owner;

  return lines.join("\n");
}
