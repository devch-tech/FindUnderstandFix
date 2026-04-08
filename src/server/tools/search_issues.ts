import { z } from "zod";
import { searchIssues } from "../../shared/github.js";
import { t, timeAgo } from "../../shared/i18n.js";
import { getLanguageDisplayName } from "../../shared/constants.js";
import type { SupportedLang } from "../../shared/types.js";

export const searchIssuesSchema = z.object({
  language: z.string().describe("Programming language (e.g. python, javascript, rust)"),
  difficulty: z.enum(["any", "beginner", "intermediate", "advanced"]).default("any"),
  type: z.enum(["bug", "feature", "any"]).default("any"),
  limit: z.number().min(1).max(20).default(10),
  lang: z.enum(["en", "es", "pt", "it"]).default("en").describe("Response language"),
});

export type SearchIssuesInput = z.infer<typeof searchIssuesSchema>;

export async function handleSearchIssues(input: SearchIssuesInput): Promise<string> {
  const { language, difficulty, type, limit, lang } = input;
  const uiLang = lang as SupportedLang;

  const issues = await searchIssues({ language, difficulty, type, limit, lang: uiLang });

  if (issues.length === 0) {
    return t(uiLang, "noResults", { language: getLanguageDisplayName(language) });
  }

  const header = `🔍 ${t(uiLang, "searchResults", {
    language: getLanguageDisplayName(language),
    count: issues.length,
  })}\n\n`;

  const lines = issues.map((issue, i) => {
    const labels = issue.labels.length > 0 ? `🏷️ ${issue.labels.join(", ")}` : "";
    const stars = issue.repoStars > 0
      ? `⭐ ${(issue.repoStars / 1000).toFixed(1)}k ${t(uiLang, "stars")}`
      : "";
    const ago = timeAgo(issue.createdAt, uiLang);
    const meta = [ago, stars, labels].filter(Boolean).join(" | ");

    return `${i + 1}. [${issue.title}] — ${issue.repoFullName}\n   📅 ${meta}\n   🔗 ${issue.url}`;
  });

  return header + lines.join("\n\n");
}
