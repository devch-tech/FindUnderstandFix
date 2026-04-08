# ============================================================
#  FindUnderstandFix -- Instalador automatico (Windows)
#  Find it. Understand it. Fix it.
# ============================================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  FindUnderstandFix -- MCP Server Installer" -ForegroundColor Cyan
Write-Host "  Find it. Understand it. Fix it." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# -- 1. Verificar Node.js ------------------------------------

try {
    $nodeVersion = node --version 2>$null
    $major = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($major -lt 20) {
        Write-Host "ERROR: Node.js v20+ required. You have $nodeVersion" -ForegroundColor Red
        Write-Host "Download: https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "OK Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# -- 2. Instalar dependencias --------------------------------

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    exit 1
}

# -- 3. Compilar TypeScript ----------------------------------

Write-Host ""
Write-Host "Building TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "OK Build successful" -ForegroundColor Green

# -- 4. GITHUB_TOKEN (requerido) -----------------------------

Write-Host ""
Write-Host "GITHUB_TOKEN (REQUIRED)" -ForegroundColor Yellow
Write-Host "   Get one at: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "   -> 'Generate new token (classic)' -> scope: public_repo" -ForegroundColor Gray
$githubToken = Read-Host "   Enter your GITHUB_TOKEN"

if ([string]::IsNullOrWhiteSpace($githubToken)) {
    Write-Host ""
    Write-Host "ERROR: GITHUB_TOKEN is required. The server cannot work without it." -ForegroundColor Red
    Write-Host ""
    Write-Host "   How to get one:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "   2. Click 'Generate new token (classic)'" -ForegroundColor Gray
    Write-Host "   3. Select scope: public_repo" -ForegroundColor Gray
    Write-Host "   4. Re-run this installer with the token" -ForegroundColor Gray
    exit 1
}

# -- 5. ANTHROPIC_API_KEY (opcional) -------------------------

Write-Host ""
Write-Host "ANTHROPIC_API_KEY (optional - needed for explain_issue and get_hints)" -ForegroundColor Yellow
$anthropicKey = Read-Host "   Enter your ANTHROPIC_API_KEY (press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($anthropicKey)) {
    Write-Host "   WARN: Skipped -- explain_issue and get_hints will not work without it" -ForegroundColor DarkYellow
}

# -- 6. Configurar MCP ---------------------------------------

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverPath = Join-Path $scriptDir "dist\server\index.js"

$mcpEnv = @{ GITHUB_TOKEN = $githubToken }
if (-not [string]::IsNullOrWhiteSpace($anthropicKey)) {
    $mcpEnv.ANTHROPIC_API_KEY = $anthropicKey
}

$mcpConfig = [PSCustomObject]@{
    command = "node"
    args    = @($serverPath)
    env     = [PSCustomObject]$mcpEnv
}

function Update-Config {
    param([string]$ConfigPath, [string]$Label)

    if (-not (Test-Path $ConfigPath)) { return }

    try {
        $raw  = Get-Content $ConfigPath -Raw -Encoding UTF8
        $json = $raw | ConvertFrom-Json

        if (-not (Get-Member -InputObject $json -Name "mcpServers" -MemberType NoteProperty)) {
            $json | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value ([PSCustomObject]@{})
        }

        if (Get-Member -InputObject $json.mcpServers -Name "findunderstandfix" -MemberType NoteProperty) {
            $json.mcpServers.findunderstandfix = $mcpConfig
        } else {
            $json.mcpServers | Add-Member -MemberType NoteProperty -Name "findunderstandfix" -Value $mcpConfig
        }

        $json | ConvertTo-Json -Depth 10 | Set-Content $ConfigPath -Encoding UTF8
        Write-Host "OK $Label updated" -ForegroundColor Green
    } catch {
        Write-Host "WARN Could not update $Label : $_" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "Configuring MCP servers..." -ForegroundColor Yellow

Update-Config -ConfigPath "$env:APPDATA\Claude\claude_desktop_config.json" -Label "Claude Desktop"
Update-Config -ConfigPath "$env:USERPROFILE\.claude\settings.json"         -Label "Claude Code"

# -- Resumen -------------------------------------------------

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  OK FindUnderstandFix installed successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Usage examples:" -ForegroundColor Cyan
Write-Host "  'Search for open Python issues for beginners'" -ForegroundColor Gray
Write-Host "  'Explain this issue: <GitHub issue URL>'" -ForegroundColor Gray
Write-Host "  'Give me steps to contribute to that issue'" -ForegroundColor Gray
Write-Host "  'Give me a hint to solve it'" -ForegroundColor Gray
Write-Host ""
Write-Host "Restart Claude Desktop / Claude Code to load the MCP server." -ForegroundColor Yellow
Write-Host ""
