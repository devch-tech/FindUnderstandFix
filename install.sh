#!/usr/bin/env bash
set -e

echo ""
echo "================================================"
echo "  FindUnderstandFix — MCP Server Installer"
echo "  Find it. Understand it. Fix it."
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "❌ Node.js v20+ required. You have $(node --version)"
    echo "Download: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version) detected"

# Install & build
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build successful"

# GITHUB_TOKEN (required)
echo ""
echo "🔑 GITHUB_TOKEN (REQUIRED)"
echo "   Get one at: https://github.com/settings/tokens"
echo "   → 'Generate new token (classic)' → scope: public_repo"
read -p "   Enter your GITHUB_TOKEN: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "❌ GITHUB_TOKEN is required. The server cannot work without it."
    echo ""
    echo "   How to get one:"
    echo "   1. Go to https://github.com/settings/tokens"
    echo "   2. Click 'Generate new token (classic)'"
    echo "   3. Select scope: public_repo"
    echo "   4. Re-run this installer with the token"
    exit 1
fi

# ANTHROPIC_API_KEY (optional)
echo ""
echo "🤖 ANTHROPIC_API_KEY (optional — needed for explain_issue and get_hints)"
read -p "   Enter your ANTHROPIC_API_KEY (press Enter to skip): " ANTHROPIC_KEY

if [ -z "$ANTHROPIC_KEY" ]; then
    echo "   ⚠️  Skipped — explain_issue and get_hints will not work without it"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_PATH="$SCRIPT_DIR/dist/server/index.js"

update_json_config() {
    local config_path="$1"
    local key="$2"
    if [ -f "$config_path" ] && command -v python3 &>/dev/null; then
        echo ""
        echo "📝 Updating $config_path..."
        python3 - <<EOF
import json, sys

config_path = "$config_path"
with open(config_path, 'r') as f:
    config = json.load(f)

if 'mcpServers' not in config:
    config['mcpServers'] = {}

entry = {
    "command": "node",
    "args": ["$SERVER_PATH"],
    "env": {"GITHUB_TOKEN": "$GITHUB_TOKEN"}
}
if "$ANTHROPIC_KEY":
    entry["env"]["ANTHROPIC_API_KEY"] = "$ANTHROPIC_KEY"

config['mcpServers']['findunderstandfix'] = entry

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

print("✅ Updated successfully")
EOF
    fi
}

# Claude Desktop (macOS)
update_json_config "$HOME/Library/Application Support/Claude/claude_desktop_config.json" "findunderstandfix"

# Claude Code
update_json_config "$HOME/.claude/settings.json" "findunderstandfix"

echo ""
echo "================================================"
echo "  ✅ FindUnderstandFix installed successfully!"
echo "================================================"
echo ""
echo "Usage examples:"
echo '  "Search for open Python issues for beginners"'
echo '  "Explain this issue: <GitHub issue URL>"'
echo '  "Give me steps to contribute to that issue"'
echo '  "Give me a hint to solve it"'
echo ""
echo "Restart Claude Desktop / Claude Code to load the MCP server."
echo ""
