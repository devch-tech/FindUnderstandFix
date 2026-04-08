# FindUnderstandFix — Windows Installer
# Find it. Understand it. Fix it.

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  FindUnderstandFix — MCP Server Installer" -ForegroundColor Cyan
Write-Host "  Find it. Understand it. Fix it." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version 2>$null
    $major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($major -lt 20) {
        Write-Host "❌ Node.js v20+ required. You have $nodeVersion" -ForegroundColor Red
        Write-Host "Download: https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "❌ npm install failed" -ForegroundColor Red; exit 1 }

# Build
Write-Host ""
Write-Host "🔨 Building TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build failed" -ForegroundColor Red; exit 1 }
Write-Host "✅ Build successful" -ForegroundColor Green

# GITHUB_TOKEN (required)
Write-Host ""
Write-Host "🔑 GITHUB_TOKEN (REQUIRED)" -ForegroundColor Yellow
Write-Host "   Get one at: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "   → 'Generate new token (classic)' → scope: public_repo" -ForegroundColor Gray
$githubToken = Read-Host "   Enter your GITHUB_TOKEN"

if ([string]::IsNullOrWhiteSpace($githubToken)) {
    Write-Host ""
    Write-Host "❌ GITHUB_TOKEN is required. The server cannot work without it." -ForegroundColor Red
    Write-Host ""
    Write-Host "   How to get one:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "   2. Click 'Generate new token (classic)'" -ForegroundColor Gray
    Write-Host "   3. Select scope: public_repo" -ForegroundColor Gray
    Write-Host "   4. Re-run this installer with the token" -ForegroundColor Gray
    exit 1
}

# ANTHROPIC_API_KEY (optional)
Write-Host ""
Write-Host "🤖 ANTHROPIC_API_KEY (optional — needed for explain_issue and get_hints)" -ForegroundColor Yellow
$anthropicKey = Read-Host "   Enter your ANTHROPIC_API_KEY (press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($anthropicKey)) {
    Write-Host "   ⚠️  Skipped — explain_issue and get_hints will not work without it" -ForegroundColor DarkYellow
}

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverPath = Join-Path $scriptDir "dist\server\index.js"

$mcpConfig = @{
    command = "node"
    args = @($serverPath)
    env = @{
        GITHUB_TOKEN = $githubToken
    }
}

if (-not [string]::IsNullOrWhiteSpace($anthropicKey)) {
    $mcpConfig.env.ANTHROPIC_API_KEY = $anthropicKey
}

# Update Claude Desktop config
$desktopConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"
if (Test-Path $desktopConfigPath) {
    Write-Host ""
    Write-Host "📝 Updating Claude Desktop config..." -ForegroundColor Yellow
    try {
        $config = Get-Content $desktopConfigPath -Raw | ConvertFrom-Json
        if (-not $config.mcpServers) { $config | Add-Member -MemberType NoteProperty -Name mcpServers -Value @{} }
        $config.mcpServers | Add-Member -MemberType NoteProperty -Name findunderstandfix -Value $mcpConfig -Force
        $config | ConvertTo-Json -Depth 10 | Set-Content $desktopConfigPath
        Write-Host "✅ Claude Desktop config updated" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not update Claude Desktop config: $_" -ForegroundColor DarkYellow
    }
}

# Update Claude Code settings
$claudeCodePath = "$env:USERPROFILE\.claude\settings.json"
if (Test-Path $claudeCodePath) {
    Write-Host ""
    Write-Host "📝 Updating Claude Code settings..." -ForegroundColor Yellow
    try {
        $settings = Get-Content $claudeCodePath -Raw | ConvertFrom-Json
        if (-not $settings.mcpServers) { $settings | Add-Member -MemberType NoteProperty -Name mcpServers -Value @{} }
        $settings.mcpServers | Add-Member -MemberType NoteProperty -Name findunderstandfix -Value $mcpConfig -Force
        $settings | ConvertTo-Json -Depth 10 | Set-Content $claudeCodePath
        Write-Host "✅ Claude Code settings updated" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not update Claude Code settings: $_" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  ✅ FindUnderstandFix installed successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Usage examples:" -ForegroundColor Cyan
Write-Host '  "Search for open Python issues for beginners"' -ForegroundColor Gray
Write-Host '  "Explain this issue: <GitHub issue URL>"' -ForegroundColor Gray
Write-Host '  "Give me steps to contribute to that issue"' -ForegroundColor Gray
Write-Host '  "Give me a hint to solve it"' -ForegroundColor Gray
Write-Host ""
Write-Host "Restart Claude Desktop / Claude Code to load the MCP server." -ForegroundColor Yellow
Write-Host ""
