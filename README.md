<div align="center">

<img src="https://img.shields.io/badge/-%F0%9F%94%8D%20Find%20%C2%B7%20%F0%9F%A7%A0%20Understand%20%C2%B7%20%F0%9F%94%A7%20Fix-1a1a2e?style=for-the-badge&labelColor=1a1a2e" alt="tagline"/>

# FindUnderstandFix

**Servidor MCP que conecta Claude con GitHub para guiarte en tu primera contribución open source.**

<br/>

[![Stars](https://img.shields.io/github/stars/devch-tech/FindUnderstandFix?style=for-the-badge&logo=github&color=FFD700&labelColor=1a1a2e)](https://github.com/devch-tech/FindUnderstandFix/stargazers)
[![License](https://img.shields.io/badge/Licencia-MIT-22c55e?style=for-the-badge&labelColor=1a1a2e)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Bienvenidas-a855f7?style=for-the-badge&logo=github&labelColor=1a1a2e)](https://github.com/devch-tech/FindUnderstandFix/pulls)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=1a1a2e)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e)](https://www.typescriptlang.org)
[![MCP](https://img.shields.io/badge/MCP-Compatible-f97316?style=for-the-badge&labelColor=1a1a2e)](https://modelcontextprotocol.io)

<br/>

[![ES](https://img.shields.io/badge/ES-Español-red?style=flat-square)](README.md)
[![EN](https://img.shields.io/badge/EN-English-blue?style=flat-square)](README.md)
[![PT](https://img.shields.io/badge/PT-Português-green?style=flat-square)](README.md)
[![IT](https://img.shields.io/badge/IT-Italiano-008C45?style=flat-square)](README.md)

</div>

---

## ¿Qué es esto?

**FindUnderstandFix** es un servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) que le da a Claude 5 herramientas nuevas para ayudarte a contribuir a proyectos open source — sin salir del chat.

> 💡 No hay comandos que memorizar. Solo habla con Claude de forma natural.

| | ¿Para quién? |
|---|---|
| 🟢 | Quieres hacer tu primera contribución open source pero no sabes por dónde empezar |
| 🟢 | Buscas issues reales en repos activos filtradas por lenguaje y dificultad |
| 🟢 | Necesitas que alguien te explique una issue antes de tocarla |
| 🟢 | Quieres los comandos git exactos, no una explicación genérica |

---

## Cómo funciona

```
┌─────────────────────────────────────────────────────────────────┐
│                        Tú le hablas a Claude                    │
│      "Busca issues de Python para principiantes"                │
└──────────────────────────────┬──────────────────────────────────┘
                               │  MCP (stdio)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FindUnderstandFix Server                      │
│                                                                 │
│  🔍 search_issues        📋 get_issue_detail                    │
│  🧠 explain_issue        🚀 get_contribution_guide              │
│  💡 get_hints                                                   │
└──────────────┬──────────────────────────┬───────────────────────┘
               │                          │
               ▼                          ▼
   ┌───────────────────┐      ┌─────────────────────┐
   │  GitHub REST API  │      │  Claude Haiku (LLM) │
   │  Issues · Repos   │      │  Explain · Hints    │
   └───────────────────┘      └─────────────────────┘
```

---

## Demo

<div align="center">

| Paso | Le dices a Claude | Claude hace |
|------|-------------------|-------------|
| 1️⃣ | *"Busca issues de Rust para principiantes"* | Llama a `search_issues` → muestra lista con repos, stars y labels |
| 2️⃣ | *"Explícame la issue #3"* | Llama a `get_issue_detail` + `explain_issue` → explicación didáctica |
| 3️⃣ | *"Dame los pasos para contribuir, mi usuario es devch"* | Llama a `get_contribution_guide` → guía de 10 pasos con comandos git exactos |
| 4️⃣ | *"Dame una pista para resolverla"* | Llama a `get_hints` → pista sin revelar la solución |
| 5️⃣ | *"Una pista más específica"* | Llama a `get_hints` nivel 2 → pista más concreta |

</div>

### Ejemplo de conversación real

```
> Busca issues abiertas en Python para principiantes, respóndeme en español

🔍 Issues abiertas en Python (10 resultados)

1. [Fix incorrect timezone handling in datetime.fromisoformat] — python/cpython
   📅 Hace 1 día | ⭐ 62.4k estrellas | 🏷️ bug, good first issue
   🔗 https://github.com/python/cpython/issues/9821

2. [Add type hints to pathlib.Path methods] — python/cpython
   📅 Hace 3 días | ⭐ 62.4k estrellas | 🏷️ enhancement, good first issue
   🔗 https://github.com/python/cpython/issues/9734
...
```

```
> Explícame la issue #1

🧠 EXPLICACIÓN — Fix incorrect timezone handling in datetime.fromisoformat

¿De qué se trata?
Esta issue reporta que datetime.fromisoformat() no interpreta correctamente
los offsets de zona horaria cuando el string incluye el formato "+HH:MM:SS"...

¿Por qué ocurre?
La función solo valida offsets de 5 caracteres (+HH:MM) pero el estándar
ISO 8601 también permite segundos en el offset (+HH:MM:SS)...

¿Cuál es el impacto?
Afecta a cualquier aplicación que procese timestamps internacionales...

¿Por qué es buena para empezar?
El fix es puntual (~15 líneas), hay un test que falla reproducible y
los maintainers dejaron pistas claras en los comentarios.
```

---

## Requisitos

```
Node.js v20+          https://nodejs.org
GitHub Token          https://github.com/settings/tokens  (scope: public_repo)
Claude Desktop        https://claude.ai/download
  o Claude Code       npm install -g @anthropic/claude-code
Anthropic API Key     https://console.anthropic.com  (opcional — para explain e hints)
```

---

## Instalación

### Opción A — Instalador automático ✅ Recomendado

**Windows:**
```powershell
git clone https://github.com/devch-tech/FindUnderstandFix.git
cd FindUnderstandFix
.\install.ps1
```

**macOS / Linux:**
```bash
git clone https://github.com/devch-tech/FindUnderstandFix.git
cd FindUnderstandFix
chmod +x install.sh && ./install.sh
```

El instalador hace todo: verifica Node.js, compila, pide los tokens y actualiza la config de Claude.

---

### Opción B — Instalación manual

**1. Clonar y compilar**
```bash
git clone https://github.com/devch-tech/FindUnderstandFix.git
cd FindUnderstandFix
npm install && npm run build
```

**2. Agregar a Claude Code** — edita `~/.claude.json`:
```json
{
  "mcpServers": {
    "findunderstandfix": {
      "command": "node",
      "args": ["/ruta/absoluta/FindUnderstandFix/dist/server/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_...",
        "ANTHROPIC_API_KEY": "sk-ant-..."
      },
      "type": "stdio"
    }
  }
}
```

**3. Agregar a Claude Desktop** — edita:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "findunderstandfix": {
      "command": "node",
      "args": ["/ruta/absoluta/FindUnderstandFix/dist/server/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_...",
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

**4. Reiniciar Claude** y verificar con `/mcp` → debe aparecer `findunderstandfix · connected`

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|:---------:|-------------|
| `GITHUB_TOKEN` | ✅ **Sí** | Personal Access Token de GitHub. Sin él el servidor no arranca. [Obtener aquí](https://github.com/settings/tokens) → scope: `public_repo` |
| `ANTHROPIC_API_KEY` | ⚪ No | Para `explain_issue` y `get_hints`. Sin ella esas dos herramientas devuelven error. [Obtener aquí](https://console.anthropic.com) |
| `ISSUESCOUT_DEFAULT_LANG` | ⚪ No | Idioma por defecto: `en` `es` `pt` `it`. Default: `en` |

---

## Herramientas

<details>
<summary><b>🔍 search_issues — Buscar issues abiertas</b></summary>

Busca en GitHub issues abiertas filtradas por lenguaje, dificultad y tipo.

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `language` | string | — | `python` `javascript` `rust` `go` `java` `typescript` `cpp` `csharp` `c` `kotlin` `swift` `ruby` `php` `scala` `elixir` `dart` `shell` |
| `difficulty` | enum | `any` | `beginner` → label `good first issue` · `intermediate` → `help wanted` · `advanced` |
| `type` | enum | `any` | `bug` · `feature` · `any` |
| `limit` | number | `10` | 1–20 resultados |
| `lang` | enum | `en` | `en` `es` `pt` `it` — idioma de la respuesta |

**Frases que lo activan:**
```
"Busca issues de Python para principiantes"
"Show me beginner Rust bugs"
"Encuentra 5 issues de Go de dificultad intermedia"
"Find JavaScript feature requests, answer in English"
```
</details>

<details>
<summary><b>📋 get_issue_detail — Ver detalle completo de una issue</b></summary>

Obtiene título, descripción, labels, autor, comentarios y datos del repositorio.

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `issue_url` | URL | — | URL completa de la issue en GitHub |
| `lang` | enum | `en` | Idioma de la respuesta |

**Frases que lo activan:**
```
"Muéstrame el detalle de https://github.com/owner/repo/issues/123"
"¿De qué trata la issue #3?"
"Get the full info of that issue"
```
</details>

<details>
<summary><b>🧠 explain_issue — Explicación didáctica con IA</b></summary>

Usa Claude Haiku para explicar la issue adaptada a tu nivel. Cubre: qué es, por qué ocurre, impacto y por qué es buena para empezar.

> Requiere `ANTHROPIC_API_KEY`

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `issue_url` | URL | — | URL completa de la issue |
| `lang` | enum | `en` | Idioma de la explicación |
| `level` | enum | `intermediate` | `beginner` · `intermediate` · `advanced` |

**Frases que lo activan:**
```
"Explícame esa issue"
"Explain this issue for a beginner"
"¿De qué trata esta issue? Nivel avanzado"
```
</details>

<details>
<summary><b>🚀 get_contribution_guide — Guía de contribución paso a paso</b></summary>

Genera 10 pasos con comandos git exactos y personalizados para contribuir. No usa LLM — los comandos son deterministas y se basan en datos reales del repo.

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `issue_url` | URL | — | URL completa de la issue |
| `lang` | enum | `en` | Idioma de la guía |
| `git_username` | string | `YOUR_USERNAME` | Tu usuario de GitHub para personalizar los comandos |

**Frases que lo activan:**
```
"Dame los pasos para contribuir, mi usuario es devch"
"How do I start contributing? My username is devch"
"Walk me through contributing to that issue"
```
</details>

<details>
<summary><b>💡 get_hints — Pistas escalonadas sin revelar la solución</b></summary>

Genera pistas de nivel 1 a 3 para ayudarte a resolver la issue sin darte la respuesta directa.

> Requiere `ANTHROPIC_API_KEY`

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `issue_url` | URL | — | URL completa de la issue |
| `lang` | enum | `en` | Idioma de las pistas |
| `hint_level` | 1–3 | `1` | 1 = dirección general · 2 = área específica · 3 = casi la solución |

**Frases que lo activan:**
```
"Dame una pista para resolver esa issue"
"Give me a more specific hint"
"Dame la pista 3"
```
</details>

---

## Lenguajes soportados

<div align="center">

| Tier 1 — Prioritarios | Tier 2 — Soportados |
|:---------------------:|:-------------------:|
| Java · Python · JavaScript · TypeScript | Ruby · PHP · Scala · Elixir |
| Go · Rust · C++ · C# · C | Dart · Shell |
| Kotlin · Swift | |

**Alias:** `c++` → C++ · `c#` → C# · `csharp` → C# · `cpp` → C++

</div>

---

## Caché

| Herramienta | TTL |
|-------------|-----|
| `search_issues` | 15 minutos |
| `get_issue_detail` | 30 minutos |

---

## Errores frecuentes

| Error | Solución |
|-------|----------|
| `findunderstandfix` no aparece en `/mcp` | El servidor no arrancó — verifica que `GITHUB_TOKEN` esté en el config |
| `❌ GITHUB_TOKEN is required` | Agrega el token en el bloque `env` de tu config MCP |
| `❌ ANTHROPIC_API_KEY is not set` | Solo afecta a `explain_issue` y `get_hints` — el resto funciona sin ella |
| Rate limit de GitHub | Espera unos minutos o usa un token con más permisos |
| Issue no encontrada | Verifica que la URL sea correcta y la issue sea pública |

---

## Estructura del proyecto

```
FindUnderstandFix/
├── src/
│   ├── shared/
│   │   ├── types.ts          # Interfaces TypeScript compartidas
│   │   ├── constants.ts      # Lenguajes soportados, alias, display names
│   │   ├── i18n.ts           # Traducciones EN/ES/PT/IT + helper t()
│   │   ├── cache.ts          # Caché en memoria con TTL
│   │   ├── github.ts         # Cliente GitHub REST API
│   │   └── anthropic.ts      # Cliente Claude Haiku
│   └── server/
│       ├── tools/
│       │   ├── search_issues.ts
│       │   ├── get_issue_detail.ts
│       │   ├── explain_issue.ts
│       │   ├── get_contribution_guide.ts
│       │   └── get_hints.ts
│       └── index.ts          # Entry point MCP
├── dist/                     # Compilado por tsc (no se sube al repo)
├── install.ps1               # Instalador Windows
├── install.sh                # Instalador macOS/Linux
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Contribuir

¡Las PRs son bienvenidas! Si encuentras un bug o quieres agregar soporte para un nuevo lenguaje:

1. Fork → rama → cambios → PR
2. Describe el problema que resuelve tu PR
3. Si agregas un lenguaje nuevo, actualiza `src/shared/constants.ts`

---

<div align="center">

Hecho con ❤️ usando [Claude](https://claude.ai) · [Model Context Protocol](https://modelcontextprotocol.io) · [GitHub API](https://docs.github.com/en/rest)

[![GitHub](https://img.shields.io/badge/devch--tech-FindUnderstandFix-1a1a2e?style=for-the-badge&logo=github)](https://github.com/devch-tech/FindUnderstandFix)

</div>
