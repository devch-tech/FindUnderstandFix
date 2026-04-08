import { z } from "zod";
import { getIssueDetail } from "../../shared/github.js";
import { generateHints } from "../../shared/anthropic.js";
import { t } from "../../shared/i18n.js";
import type { SupportedLang } from "../../shared/types.js";

export const getHintsSchema = z.object({
  issue_url: z.string().url().describe("Full GitHub issue URL"),
  lang: z.enum(["en", "es", "pt", "it"]).default("en").describe("Response language"),
  hint_level: z.number().min(1).max(3).default(1).describe("1=vague, 3=very specific"),
});

export type GetHintsInput = z.infer<typeof getHintsSchema>;

export async function handleGetHints(input: GetHintsInput): Promise<string> {
  const { issue_url, lang, hint_level } = input;
  const uiLang = lang as SupportedLang;

  const detail = await getIssueDetail(issue_url);
  const hints = await generateHints(detail, uiLang, hint_level);

  const footer = hint_level < 3
    ? `\n\n${t(uiLang, "wantMoreHints", { next: hint_level + 1 })}`
    : "";

  return `💡 ${t(uiLang, "hintsTitle")}\n\n${hints}${footer}`;
}
