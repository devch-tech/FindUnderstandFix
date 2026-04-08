#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { validateToken } from "../shared/github.js";

import { searchIssuesSchema, handleSearchIssues } from "./tools/search_issues.js";
import { getIssueDetailSchema, handleGetIssueDetail } from "./tools/get_issue_detail.js";
import { explainIssueSchema, handleExplainIssue } from "./tools/explain_issue.js";
import { getContributionGuideSchema, handleGetContributionGuide } from "./tools/get_contribution_guide.js";
import { getHintsSchema, handleGetHints } from "./tools/get_hints.js";

async function main() {
  // Validate GitHub token on startup
  try {
    await validateToken();
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }

  const server = new McpServer({
    name: "FindUnderstandFix",
    version: "1.0.0",
  });

  server.tool(
    "search_issues",
    "Search open GitHub issues filtered by programming language, difficulty, and type",
    searchIssuesSchema.shape,
    async (input) => {
      try {
        const text = await handleSearchIssues(input as Parameters<typeof handleSearchIssues>[0]);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `❌ ${msg}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_issue_detail",
    "Get full details of a specific GitHub issue including comments and repo info",
    getIssueDetailSchema.shape,
    async (input) => {
      try {
        const text = await handleGetIssueDetail(input as Parameters<typeof handleGetIssueDetail>[0]);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `❌ ${msg}` }], isError: true };
      }
    }
  );

  server.tool(
    "explain_issue",
    "Use AI to generate a clear, didactic explanation of a GitHub issue adapted to the user's level",
    explainIssueSchema.shape,
    async (input) => {
      try {
        const text = await handleExplainIssue(input as Parameters<typeof handleExplainIssue>[0]);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `❌ ${msg}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_contribution_guide",
    "Generate a step-by-step personalized guide to contribute to a specific GitHub issue",
    getContributionGuideSchema.shape,
    async (input) => {
      try {
        const text = await handleGetContributionGuide(input as Parameters<typeof handleGetContributionGuide>[0]);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `❌ ${msg}` }], isError: true };
      }
    }
  );

  server.tool(
    "get_hints",
    "Get escalating hints (1-3) for solving a GitHub issue without giving away the solution",
    getHintsSchema.shape,
    async (input) => {
      try {
        const text = await handleGetHints(input as Parameters<typeof handleGetHints>[0]);
        return { content: [{ type: "text", text }] };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `❌ ${msg}` }], isError: true };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("FindUnderstandFix MCP server running. Find it. Understand it. Fix it.\n");
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
