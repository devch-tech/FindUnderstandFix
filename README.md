# FindUnderstandFix

> **Find it. Understand it. Fix it.**

MCP server that connects directly to Claude to help developers discover open GitHub issues and guide them through making their first open source contribution.

---

## What is this?

FindUnderstandFix is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server. Once installed, Claude gains 5 new tools it can use automatically when you talk to it naturally — no commands to memorize.

**Who is it for?** Developers of any level who want to start contributing to open source but don't know where to begin.

**Languages supported:** English, Spanish, Portuguese, Italian

---

## Requirements

- Node.js v20 or higher — [nodejs.org](https://nodejs.org)
- A GitHub account with a Personal Access Token
- Claude Desktop or Claude Code
- (Optional) Anthropic API key — only needed for `explain_issue` and `get_hints`

---

## Installation

### Option A — Automatic installer (recommended)

**Windows:**
```powershell
.\install.ps1
```

**macOS / Linux:**
```bash
chmod +x install.sh
./install.sh
```

The installer will:
1. Check Node.js v20+
2. Run `npm install` and `npm run build`
3. Ask for your `GITHUB_TOKEN` (required) and `ANTHROPIC_API_KEY` (optional)
4. Automatically update your Claude Desktop and/or Claude Code configuration
5. Show usage examples

---

### Option B — Manual installation

**Step 1 — Clone and build**
```bash
git clone https://github.com/your-username/FindUnderstandFix.git
cd FindUnderstandFix
npm install
npm run build
```

**Step 2 — Get a GitHub token**

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Select scope: `public_repo`
4. Copy the token (starts with `ghp_`)

**Step 3 — Configure Claude Code**

Add this to `~/.claude/settings.json` (create it if it doesn't exist):

```json
{
  "mcpServers": {
    "findunderstandfix": {
      "command": "node",
      "args": ["/absolute/path/to/FindUnderstandFix/dist/server/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here",
        "ANTHROPIC_API_KEY": "sk-ant-your_key_here"
      }
    }
  }
}
```

**Step 4 — Configure Claude Desktop** (if you use it)

Add the same block to:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Step 5 — Restart Claude**

Close and reopen Claude Desktop or Claude Code. The server loads on startup.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | **Yes** | GitHub Personal Access Token. Without it the server won't start. |
| `ANTHROPIC_API_KEY` | No | Needed for `explain_issue` and `get_hints`. Without it those two tools return an error. |
| `ISSUESCOUT_DEFAULT_LANG` | No | Default response language: `en`, `es`, `pt`, or `it`. Defaults to `en`. |

---

## Tools reference

FindUnderstandFix registers 5 tools in Claude. You never call them directly — Claude calls them based on what you say.

---

### `search_issues`

Searches open GitHub issues filtered by programming language, difficulty, and type.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `language` | string | — | Programming language: `python`, `javascript`, `rust`, `go`, `java`, `typescript`, `cpp`, `csharp`, `c`, `kotlin`, `swift`, `ruby`, `php`, `scala`, `elixir`, `dart`, `shell` |
| `difficulty` | `any` \| `beginner` \| `intermediate` \| `advanced` | `any` | Filters by GitHub label: beginner → `good first issue`, intermediate → `help wanted` |
| `type` | `bug` \| `feature` \| `any` | `any` | Filters by label: bug → `bug`, feature → `enhancement` |
| `limit` | number (1–20) | `10` | Number of results to return |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Language for the response text |

**Example output:**
```
🔍 Open issues in Python (10 results)

1. [Fix memory leak in asyncio event loop] — numpy/numpy
   📅 2 days ago | ⭐ 24.3k stars | 🏷️ bug, good first issue
   🔗 https://github.com/numpy/numpy/issues/1234

2. [Add support for walrus operator in comprehensions] — pallets/flask
   📅 5 days ago | ⭐ 67.1k stars | 🏷️ enhancement, help wanted
   🔗 https://github.com/pallets/flask/issues/5678
```

**How to trigger it:**
```
"Search for open Python issues for beginners"
"Show me beginner Rust bugs"
"Find JavaScript feature requests, answer in Spanish"
"Search 5 Go issues, intermediate difficulty"
```

---

### `get_issue_detail`

Fetches the full details of a specific GitHub issue: description, labels, author, comments, and repository information.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `issue_url` | string (URL) | — | Full GitHub issue URL, e.g. `https://github.com/owner/repo/issues/123` |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Language for labels and metadata |

**Example output:**
```
📋 ISSUE DETAIL

Language: Python | ⭐ 24,312 stars
Repository: numpy/numpy
A fundamental package for scientific computing with Python

Issue #1234: Fix memory leak in asyncio event loop
State: Open | Created: 1/12/2026 | Author: @user123
Labels: bug, good first issue

[full issue description here]

RELEVANT COMMENTS: 3 comments

@maintainer (2 days ago):
The problem seems to be in Lib/asyncio/tasks.py around line 380...

📖 OFFICIAL CONTRIBUTING GUIDE:
https://github.com/numpy/numpy/blob/main/CONTRIBUTING.md
```

**How to trigger it:**
```
"Show me the detail of this issue: https://github.com/owner/repo/issues/123"
"What is issue #3 about?" (after a search, Claude picks the URL automatically)
"Get the full info of that issue"
```

---

### `explain_issue`

Uses Claude Haiku to generate a clear, structured explanation of a GitHub issue adapted to the developer's experience level.

> Requires `ANTHROPIC_API_KEY`

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `issue_url` | string (URL) | — | Full GitHub issue URL |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Language for the explanation |
| `level` | `beginner` \| `intermediate` \| `advanced` | `intermediate` | Depth and technicality of the explanation |

**The explanation always covers:**
1. What is the issue about? (plain language)
2. Why does it happen? (technical root cause or hypothesis)
3. What is the impact? (who is affected, severity)
4. Why is it a good issue to work on? (difficulty, learning value)

**Example output (Spanish, intermediate):**
```
🧠 EXPLANATION — Fix memory leak in asyncio event loop

¿De qué se trata?
Esta issue reporta una pérdida de memoria en el event loop de asyncio cuando
se crean múltiples tareas concurrentes sin cancelarlas explícitamente...

¿Por qué ocurre?
El problema está en cómo asyncio maneja las referencias débiles (weakrefs)...

¿Cuál es el impacto?
Afecta aplicaciones de larga duración que crean muchas tareas...

¿Por qué es buena para empezar?
Está etiquetada como "good first issue". El fix probable es pequeño (< 20 líneas)...
```

**How to trigger it:**
```
"Explain that issue to me"
"Explain this issue for a beginner: https://github.com/owner/repo/issues/123"
"What is this issue about, explain it in Portuguese"
"Explain issue #2 from the list at an advanced level"
```

---

### `get_contribution_guide`

Generates a step-by-step, personalized guide with exact git commands to contribute to a specific issue. This tool does NOT use an LLM — commands are deterministic and based on real repo data.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `issue_url` | string (URL) | — | Full GitHub issue URL |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Language for the guide text |
| `git_username` | string | `YOUR_USERNAME` | Your GitHub username, used to personalize clone/push commands |

**The guide covers 10 steps:**
1. Fork the repository
2. Clone your fork
3. Configure upstream remote
4. Create a branch (named after the issue number and title)
5. Install dependencies
6. Reproduce the problem
7. Make your changes
8. Sync with upstream before PR
9. Push your branch
10. Open the Pull Request (with link to the correct compare URL)

**Example output:**
```
🚀 CONTRIBUTION GUIDE — numpy/numpy

STEP 1 — Fork the repository
Go to: https://github.com/numpy/numpy
Click the "Fork" button (top right)
This creates a copy in your account: github.com/your-username/numpy

STEP 2 — Clone your fork
git clone https://github.com/your-username/numpy.git
cd numpy

STEP 3 — Configure upstream remote
git remote add upstream https://github.com/numpy/numpy.git
git fetch upstream

STEP 4 — Create a branch for your work
git checkout -b fix/issue-1234-fix-memory-leak-in-asyncio-event-lo

...

📖 OFFICIAL CONTRIBUTING GUIDE:
https://github.com/numpy/numpy/blob/main/CONTRIBUTING.md
```

**How to trigger it:**
```
"Give me the steps to contribute to that issue"
"How do I start contributing? My username is devch"
"Walk me through contributing to https://github.com/owner/repo/issues/123"
"Dame los pasos para contribuir a esa issue, mi usuario es devch"
```

---

### `get_hints`

Generates escalating hints to help solve an issue without giving away the solution. Uses Claude Haiku.

> Requires `ANTHROPIC_API_KEY`

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `issue_url` | string (URL) | — | Full GitHub issue URL |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Language for the hints |
| `hint_level` | number (1–3) | `1` | 1 = vague direction, 2 = specific area, 3 = near-solution |

**Hint levels:**
- **Level 1** — General direction: which module or directory to look at
- **Level 2** — Specific area: file name, relevant function names
- **Level 3** — Near-solution: what to change conceptually, without writing code

**Example output (level 2, Spanish):**
```
💡 HINTS FOR SOLVING THE ISSUE

Hint 1 — Where to look?
The problem is in the asyncio task management module.
Look in the Lib/asyncio/ directory, specifically files related to tasks and events.

Hint 2 — Which function to review?
Focus on how callbacks are registered and unregistered.
Look for methods containing "remove_done_callback" or similar.
Compare how references are created vs how they are cleaned up.

Want hint 3? Ask me "give me hint 3 for this issue".
```

**How to trigger it:**
```
"Give me a hint to solve that issue"
"Give me hint 2"
"I need a more specific hint"
"Dame una pista más concreta para resolver esta issue"
"Give me the most specific hint (level 3)"
```

---

## Full usage flow example

```
You: Search for beginner Python issues, answer in Spanish

Claude: [calls search_issues] → shows 10 results

You: Explain issue #3

Claude: [calls get_issue_detail + explain_issue] → shows full detail and explanation

You: Give me the steps to contribute, my username is devch

Claude: [calls get_contribution_guide] → shows 10-step guide with exact git commands

You: Give me a hint to solve it

Claude: [calls get_hints level 1] → shows vague hint

You: Give me a more specific hint

Claude: [calls get_hints level 2] → shows specific hint

You: One more hint

Claude: [calls get_hints level 3] → shows near-solution hint
```

---

## Supported languages

**Tier 1 (primary):** Java, Python, JavaScript, TypeScript, Go, Rust, C++, C#, C, Kotlin, Swift

**Tier 2 (supported):** Ruby, PHP, Scala, Elixir, Dart, Shell

**Aliases accepted:** `c++` → C++, `c#` → C#, `csharp` → C#, `cpp` → C++

---

## Caching

Results are cached in memory to avoid hitting GitHub's rate limits:

| Tool | Cache TTL |
|------|-----------|
| `search_issues` | 15 minutes |
| `get_issue_detail` | 30 minutes |

---

## Error messages

| Situation | What you'll see |
|-----------|----------------|
| Missing or invalid `GITHUB_TOKEN` | Instructions to generate a token at github.com/settings/tokens |
| GitHub rate limit reached | How many seconds until the limit resets |
| Issue URL not found | "Check that the URL is correct" |
| Missing `ANTHROPIC_API_KEY` | Explains which tools need it |
| Unsupported language | Lists all supported languages |
| No internet connection | "Check your internet connection" |

---

## Project structure

```
FindUnderstandFix/
├── src/
│   ├── shared/
│   │   ├── types.ts          # Shared TypeScript interfaces
│   │   ├── constants.ts      # Supported languages, aliases, display names
│   │   ├── i18n.ts           # EN/ES/PT/IT translations + t() helper
│   │   ├── cache.ts          # In-memory cache with TTL
│   │   ├── github.ts         # GitHub REST API client
│   │   └── anthropic.ts      # Claude Haiku client (explain + hints)
│   └── server/
│       ├── tools/
│       │   ├── search_issues.ts
│       │   ├── get_issue_detail.ts
│       │   ├── explain_issue.ts
│       │   ├── get_contribution_guide.ts
│       │   └── get_hints.ts
│       └── index.ts          # MCP server entry point
├── dist/                     # Compiled output (generated by tsc)
├── install.ps1               # Windows auto-installer
├── install.sh                # macOS/Linux auto-installer
├── package.json
├── tsconfig.json
└── .env.example
```

---

## License

MIT
