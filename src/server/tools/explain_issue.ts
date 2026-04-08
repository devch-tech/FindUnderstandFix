import { z } from "zod";
import { getIssueDetail } from "../../shared/github.js";
import { explainIssue } from "../../shared/anthropic.js";
import { t } from "../../shared/i18n.js";
import type { SupportedLang } from "../../shared/types.js";

export const explainIssueSchema = z.object({
  issue_url: z.string().url().describe("Full GitHub issue URL"),
  lang: z.enum(["en", "es", "pt", "it"]).default("en").describe("Response language"),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate").describe("Explanation depth"),
});

export type ExplainIssueInput = z.infer<typeof explainIssueSchema>;

export async function handleExplainIssue(input: ExplainIssueInput): Promise<string> {
  const { issue_url, lang, level } = input;
  const uiLang = lang as SupportedLang;

  const detail = await getIssueDetail(issue_url);
  const explanation = await explainIssue(detail, uiLang, level);

  return `🧠 ${t(uiLang, "explanation")} — ${detail.title}\n\n${explanation}`;
}
