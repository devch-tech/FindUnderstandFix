import Anthropic from "@anthropic-ai/sdk";
import type { IssueDetail, SupportedLang } from "./types.js";
import { LANGUAGE_NAME_FOR_PROMPT } from "./constants.js";

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. explain_issue and get_hints require it.\n" +
      "Add it to your .env file or MCP configuration."
    );
  }
  return new Anthropic({ apiKey: key });
}

export async function explainIssue(
  detail: IssueDetail,
  lang: SupportedLang,
  level: "beginner" | "intermediate" | "advanced"
): Promise<string> {
  const client = getClient();
  const langName = LANGUAGE_NAME_FOR_PROMPT[lang];

  const prompt = `You are a senior software engineer explaining a GitHub issue to a developer.
Respond ONLY in ${langName}. Target level: ${level}.

Issue title: ${detail.title}
Repository: ${detail.repoFullName} (${detail.repoLanguage ?? "unknown language"})
Issue body: ${detail.body ?? "(no description)"}
Labels: ${detail.labels.join(", ") || "none"}
Comments excerpt: ${detail.comments.map((c) => `@${c.author}: ${c.body.slice(0, 300)}`).join("\n\n") || "none"}

Explain in a clear, structured way:
1. **What is this issue about?** (2-3 sentences, plain language)
2. **Why does it happen?** (technical root cause if known, or hypothesis)
3. **What is the impact?** (who is affected, how severe)
4. **Why is it a good issue to work on?** (difficulty, learning value)

Be concrete, not generic. Avoid filler phrases. Base your explanation only on the information provided.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response from Claude");
  return content.text;
}

export async function generateHints(
  detail: IssueDetail,
  lang: SupportedLang,
  hintLevel: number
): Promise<string> {
  const client = getClient();
  const langName = LANGUAGE_NAME_FOR_PROMPT[lang];

  const prompt = `You are a senior mentor helping a developer solve a GitHub issue.
Respond ONLY in ${langName}.
DO NOT give the solution. Give ${hintLevel} hints, from vague to specific.

Hint level guide:
- Level 1: General direction (which file/module to look at)
- Level 2: Specific area within the file, relevant function names
- Level 3: Near-solution hint (what to change conceptually, without code)

Issue: ${detail.title}
Body: ${detail.body ?? "(no description)"}
Labels: ${detail.labels.join(", ") || "none"}
Comments: ${detail.comments.map((c) => `@${c.author}: ${c.body.slice(0, 300)}`).join("\n\n") || "none"}

Generate exactly ${hintLevel} hint${hintLevel > 1 ? "s" : ""}, numbered, increasing in specificity.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response from Claude");
  return content.text;
}
