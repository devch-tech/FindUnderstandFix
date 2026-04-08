import { z } from "zod";
import { getIssueDetail } from "../../shared/github.js";
import { t, timeAgo } from "../../shared/i18n.js";
import type { SupportedLang } from "../../shared/types.js";

export const getIssueDetailSchema = z.object({
  issue_url: z.string().url().describe("Full GitHub issue URL"),
  lang: z.enum(["en", "es", "pt", "it"]).default("en").describe("Response language"),
});

export type GetIssueDetailInput = z.infer<typeof getIssueDetailSchema>;

export async function handleGetIssueDetail(input: GetIssueDetailInput): Promise<string> {
  const { issue_url, lang } = input;
  const uiLang = lang as SupportedLang;

  const detail = await getIssueDetail(issue_url);

  const lines: string[] = [
    `📋 ${t(uiLang, "issueDetail")}`,
    "",
    `${t(uiLang, "language")}: ${detail.repo.language ?? "Unknown"} | ⭐ ${detail.repo.stars.toLocaleString()} ${t(uiLang, "stars")}`,
    `Repository: ${detail.repoFullName}`,
    ...(detail.repo.description ? [`${detail.repo.description}`] : []),
    "",
    `Issue #${detail.number}: ${detail.title}`,
    `${t(uiLang, "state")}: ${detail.state === "open" ? t(uiLang, "open") : t(uiLang, "closed")} | ${t(uiLang, "created")}: ${new Date(detail.createdAt).toLocaleDateString()} | ${t(uiLang, "author")}: @${detail.author}`,
  ];

  if (detail.labels.length > 0) {
    lines.push(`${t(uiLang, "labels")}: ${detail.labels.join(", ")}`);
  }

  lines.push("", detail.body ?? "(no description)", "");

  if (detail.comments.length > 0) {
    lines.push(`${t(uiLang, "relevantComments")}: ${detail.commentsCount} ${t(uiLang, "comments")}`);
    for (const comment of detail.comments) {
      lines.push(`\n@${comment.author} (${timeAgo(comment.createdAt, uiLang)}):\n${comment.body.slice(0, 500)}${comment.body.length > 500 ? "..." : ""}`);
    }
    lines.push("");
  }

  if (detail.repo.contributingUrl) {
    lines.push(`📖 ${t(uiLang, "officialGuide")}:\n${detail.repo.contributingUrl}`);
  } else {
    lines.push(`ℹ️ ${t(uiLang, "noContributing")}`);
  }

  return lines.join("\n");
}
