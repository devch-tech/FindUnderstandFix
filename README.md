# FindUnderstandFix

> **Encuéntrala. Entiéndela. Resuélvela.**

Servidor MCP que se conecta directamente a Claude para ayudar a los desarrolladores a descubrir issues abiertas en GitHub y guiarlos en su primera contribución a proyectos open source.

---

## ¿Qué es esto?

FindUnderstandFix es un servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io). Una vez instalado, Claude obtiene 5 nuevas herramientas que puede usar automáticamente cuando le hablas de forma natural — no hay comandos que memorizar.

**¿Para quién es?** Desarrolladores de cualquier nivel que quieren empezar a contribuir a proyectos open source pero no saben por dónde comenzar.

**Idiomas disponibles:** Inglés, Español, Portugués, Italiano

---

## Requisitos

- Node.js v20 o superior — [nodejs.org](https://nodejs.org)
- Una cuenta de GitHub con un Personal Access Token
- Claude Desktop o Claude Code
- (Opcional) Anthropic API key — solo necesaria para `explain_issue` y `get_hints`

---

## Instalación

### Opción A — Instalador automático (recomendado)

**Windows:**
```powershell
.\install.ps1
```

**macOS / Linux:**
```bash
chmod +x install.sh
./install.sh
```

El instalador realiza lo siguiente:
1. Verifica Node.js v20+
2. Ejecuta `npm install` y `npm run build`
3. Solicita el `GITHUB_TOKEN` (requerido) y `ANTHROPIC_API_KEY` (opcional)
4. Actualiza automáticamente la configuración de Claude Desktop y/o Claude Code
5. Muestra ejemplos de uso

---

### Opción B — Instalación manual

**Paso 1 — Clonar y compilar**
```bash
git clone https://github.com/devch-tech/FindUnderstandFix.git
cd FindUnderstandFix
npm install
npm run build
```

**Paso 2 — Obtener un token de GitHub**

1. Ve a [github.com/settings/tokens](https://github.com/settings/tokens)
2. Haz clic en **"Generate new token (classic)"**
3. Selecciona el alcance: `public_repo`
4. Copia el token (comienza con `ghp_`)

**Paso 3 — Configurar Claude Code**

Agrega esto a `~/.claude/settings.json` (créalo si no existe):

```json
{
  "mcpServers": {
    "findunderstandfix": {
      "command": "node",
      "args": ["/ruta/absoluta/a/FindUnderstandFix/dist/server/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_tu_token_aqui",
        "ANTHROPIC_API_KEY": "sk-ant-tu_clave_aqui"
      }
    }
  }
}
```

**Paso 4 — Configurar Claude Desktop** (si lo usas)

Agrega el mismo bloque en:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Paso 5 — Reiniciar Claude**

Cierra y vuelve a abrir Claude Desktop o Claude Code. El servidor se carga al iniciar.

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `GITHUB_TOKEN` | **Sí** | Personal Access Token de GitHub. Sin él el servidor no arranca. |
| `ANTHROPIC_API_KEY` | No | Necesaria para `explain_issue` y `get_hints`. Sin ella esas dos herramientas devuelven un error. |
| `ISSUESCOUT_DEFAULT_LANG` | No | Idioma de respuesta por defecto: `en`, `es`, `pt` o `it`. Por defecto es `en`. |

---

## Referencia de herramientas

FindUnderstandFix registra 5 herramientas en Claude. No las llamas directamente — Claude las invoca según lo que le dices.

---

### `search_issues`

Busca issues abiertas en GitHub filtradas por lenguaje de programación, dificultad y tipo.

**Parámetros:**

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `language` | string | — | Lenguaje de programación: `python`, `javascript`, `rust`, `go`, `java`, `typescript`, `cpp`, `csharp`, `c`, `kotlin`, `swift`, `ruby`, `php`, `scala`, `elixir`, `dart`, `shell` |
| `difficulty` | `any` \| `beginner` \| `intermediate` \| `advanced` | `any` | Filtra por etiqueta de GitHub: beginner → `good first issue`, intermediate → `help wanted` |
| `type` | `bug` \| `feature` \| `any` | `any` | Filtra por etiqueta: bug → `bug`, feature → `enhancement` |
| `limit` | número (1–20) | `10` | Cantidad de resultados a devolver |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Idioma del texto de respuesta |

**Ejemplo de salida:**
```
🔍 Issues abiertas en Python (10 resultados)

1. [Fix memory leak in asyncio event loop] — numpy/numpy
   📅 Hace 2 días | ⭐ 24.3k estrellas | 🏷️ bug, good first issue
   🔗 https://github.com/numpy/numpy/issues/1234

2. [Add support for walrus operator in comprehensions] — pallets/flask
   📅 Hace 5 días | ⭐ 67.1k estrellas | 🏷️ enhancement, help wanted
   🔗 https://github.com/pallets/flask/issues/5678
```

**Cómo activarlo:**
```
"Busca issues abiertas en Python para principiantes"
"Muéstrame bugs de Rust para nivel inicial"
"Encuentra solicitudes de features en JavaScript, respóndeme en español"
"Busca 5 issues de Go, dificultad intermedia"
```

---

### `get_issue_detail`

Obtiene el detalle completo de una issue específica de GitHub: descripción, etiquetas, autor, comentarios e información del repositorio.

**Parámetros:**

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `issue_url` | string (URL) | — | URL completa de la issue en GitHub, ej. `https://github.com/owner/repo/issues/123` |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Idioma para las etiquetas y metadatos |

**Ejemplo de salida:**
```
📋 DETALLE DE ISSUE

Lenguaje: Python | ⭐ 24,312 estrellas
Repositorio: numpy/numpy
Un paquete fundamental para computación científica con Python

Issue #1234: Fix memory leak in asyncio event loop
Estado: Abierta | Creada: 12/01/2026 | Autor: @user123
Etiquetas: bug, good first issue

[descripción completa de la issue]

COMENTARIOS RELEVANTES: 3 comentarios

@maintainer (hace 2 días):
El problema parece estar en Lib/asyncio/tasks.py alrededor de la línea 380...

📖 GUÍA OFICIAL DE CONTRIBUCIÓN:
https://github.com/numpy/numpy/blob/main/CONTRIBUTING.md
```

**Cómo activarlo:**
```
"Muéstrame el detalle de esta issue: https://github.com/owner/repo/issues/123"
"¿De qué trata la issue #3?" (después de una búsqueda, Claude toma la URL automáticamente)
"Obtén la información completa de esa issue"
```

---

### `explain_issue`

Usa Claude Haiku para generar una explicación clara y estructurada de una issue de GitHub, adaptada al nivel de experiencia del desarrollador.

> Requiere `ANTHROPIC_API_KEY`

**Parámetros:**

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `issue_url` | string (URL) | — | URL completa de la issue en GitHub |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Idioma de la explicación |
| `level` | `beginner` \| `intermediate` \| `advanced` | `intermediate` | Profundidad y tecnicidad de la explicación |

**La explicación siempre cubre:**
1. ¿De qué trata la issue? (lenguaje accesible)
2. ¿Por qué ocurre? (causa raíz técnica o hipótesis)
3. ¿Cuál es el impacto? (quiénes se ven afectados, gravedad)
4. ¿Por qué es una buena issue para trabajar? (dificultad, valor de aprendizaje)

**Ejemplo de salida (español, nivel intermedio):**
```
🧠 EXPLICACIÓN — Fix memory leak in asyncio event loop

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

**Cómo activarlo:**
```
"Explícame esa issue"
"Explica esta issue para un principiante: https://github.com/owner/repo/issues/123"
"¿De qué trata esta issue? Explícamela en portugués"
"Explica la issue #2 de la lista en un nivel avanzado"
```

---

### `get_contribution_guide`

Genera una guía paso a paso y personalizada con comandos git exactos para contribuir a una issue específica. Esta herramienta **no usa un modelo de lenguaje** — los comandos son deterministas y se basan en los datos reales del repositorio.

**Parámetros:**

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `issue_url` | string (URL) | — | URL completa de la issue en GitHub |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Idioma del texto de la guía |
| `git_username` | string | `YOUR_USERNAME` | Tu nombre de usuario en GitHub, para personalizar los comandos de clonado y push |

**La guía cubre 10 pasos:**
1. Hacer fork del repositorio
2. Clonar el fork
3. Configurar el remote upstream
4. Crear una rama (con nombre basado en el número y título de la issue)
5. Instalar dependencias
6. Reproducir el problema
7. Hacer los cambios
8. Sincronizar con upstream antes del PR
9. Subir la rama
10. Abrir el Pull Request (con enlace a la URL de comparación correcta)

**Ejemplo de salida:**
```
🚀 GUÍA DE CONTRIBUCIÓN — numpy/numpy

PASO 1 — Fork del repositorio
Ve a: https://github.com/numpy/numpy
Haz clic en el botón "Fork" (arriba a la derecha)
Esto crea una copia en tu cuenta: github.com/tu-usuario/numpy

PASO 2 — Clona tu fork
git clone https://github.com/tu-usuario/numpy.git
cd numpy

PASO 3 — Configura el remote upstream
git remote add upstream https://github.com/numpy/numpy.git
git fetch upstream

PASO 4 — Crea una rama para tu trabajo
git checkout -b fix/issue-1234-fix-memory-leak-in-asyncio-event-lo

...

📖 GUÍA OFICIAL DE CONTRIBUCIÓN:
https://github.com/numpy/numpy/blob/main/CONTRIBUTING.md
```

**Cómo activarlo:**
```
"Dame los pasos para contribuir a esa issue"
"¿Cómo empiezo a contribuir? Mi usuario es devch"
"Guíame para contribuir a https://github.com/owner/repo/issues/123"
"Give me the steps to contribute to that issue, my username is devch"
```

---

### `get_hints`

Genera pistas escalonadas para ayudar a resolver una issue sin revelar la solución. Usa Claude Haiku.

> Requiere `ANTHROPIC_API_KEY`

**Parámetros:**

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `issue_url` | string (URL) | — | URL completa de la issue en GitHub |
| `lang` | `en` \| `es` \| `pt` \| `it` | `en` | Idioma de las pistas |
| `hint_level` | número (1–3) | `1` | 1 = dirección general, 2 = área específica, 3 = casi la solución |

**Niveles de pista:**
- **Nivel 1** — Dirección general: en qué módulo o directorio buscar
- **Nivel 2** — Área específica: nombre del archivo, funciones relevantes
- **Nivel 3** — Casi la solución: qué cambiar conceptualmente, sin escribir código

**Ejemplo de salida (nivel 2, español):**
```
💡 PISTAS PARA RESOLVER LA ISSUE

Pista 1 — ¿Dónde mirar?
El problema está en el módulo de gestión de tareas de asyncio.
Busca en el directorio Lib/asyncio/, específicamente los archivos
relacionados con tasks y events.

Pista 2 — ¿Qué función revisar?
Enfócate en cómo se registran y desregistran los callbacks.
Busca métodos que contengan "remove_done_callback" o similares.
Compara cómo se crean las referencias vs cómo se limpian.

¿Quieres la pista 3? Pídeme "dame la pista 3 para esta issue".
```

**Cómo activarlo:**
```
"Dame una pista para resolver esa issue"
"Dame la pista 2"
"Necesito una pista más específica"
"Dame una pista más concreta para resolver esta issue"
"Dame la pista más específica (nivel 3)"
```

---

## Ejemplo de flujo completo

```
Tú: Busca issues de Python para principiantes, respóndeme en español

Claude: [llama a search_issues] → muestra 10 resultados

Tú: Explícame la issue #3

Claude: [llama a get_issue_detail + explain_issue] → muestra detalle y explicación

Tú: Dame los pasos para contribuir, mi usuario es devch

Claude: [llama a get_contribution_guide] → muestra guía de 10 pasos con comandos git exactos

Tú: Dame una pista para resolverla

Claude: [llama a get_hints nivel 1] → muestra pista general

Tú: Dame una pista más específica

Claude: [llama a get_hints nivel 2] → muestra pista específica

Tú: Una pista más

Claude: [llama a get_hints nivel 3] → muestra pista casi-solución
```

---

## Lenguajes de programación soportados

**Nivel 1 (prioritarios):** Java, Python, JavaScript, TypeScript, Go, Rust, C++, C#, C, Kotlin, Swift

**Nivel 2 (soportados):** Ruby, PHP, Scala, Elixir, Dart, Shell

**Alias aceptados:** `c++` → C++, `c#` → C#, `csharp` → C#, `cpp` → C++

---

## Caché

Los resultados se guardan en memoria para evitar alcanzar los límites de la API de GitHub:

| Herramienta | Duración del caché |
|-------------|-------------------|
| `search_issues` | 15 minutos |
| `get_issue_detail` | 30 minutos |

---

## Mensajes de error

| Situación | Qué verás |
|-----------|-----------|
| `GITHUB_TOKEN` faltante o inválido | Instrucciones para generar un token en github.com/settings/tokens |
| Rate limit de GitHub alcanzado | Cuántos segundos faltan para que se restablezca el límite |
| URL de issue no encontrada | "Verifica que la URL sea correcta" |
| `ANTHROPIC_API_KEY` faltante | Explica qué herramientas la requieren |
| Lenguaje no soportado | Lista todos los lenguajes disponibles |
| Sin conexión a internet | "Verifica tu conexión a internet" |

---

## Estructura del proyecto

```
FindUnderstandFix/
├── src/
│   ├── shared/
│   │   ├── types.ts          # Interfaces TypeScript compartidas
│   │   ├── constants.ts      # Lenguajes soportados, alias, nombres de display
│   │   ├── i18n.ts           # Traducciones EN/ES/PT/IT + helper t()
│   │   ├── cache.ts          # Caché en memoria con TTL
│   │   ├── github.ts         # Cliente de la API REST de GitHub
│   │   └── anthropic.ts      # Cliente de Claude Haiku (explicaciones y pistas)
│   └── server/
│       ├── tools/
│       │   ├── search_issues.ts
│       │   ├── get_issue_detail.ts
│       │   ├── explain_issue.ts
│       │   ├── get_contribution_guide.ts
│       │   └── get_hints.ts
│       └── index.ts          # Punto de entrada del servidor MCP
├── dist/                     # Código compilado (generado por tsc)
├── install.ps1               # Instalador automático para Windows
├── install.sh                # Instalador automático para macOS/Linux
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Licencia

MIT
