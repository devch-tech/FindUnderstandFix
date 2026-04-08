import type { SupportedLang } from "./types.js";

type TranslationKey =
  | "searchResults"
  | "noResults"
  | "daysAgo"
  | "hoursAgo"
  | "minutesAgo"
  | "justNow"
  | "issueDetail"
  | "explanation"
  | "contributionGuide"
  | "hints"
  | "step"
  | "stars"
  | "labels"
  | "author"
  | "created"
  | "state"
  | "open"
  | "closed"
  | "comments"
  | "relevantComments"
  | "officialGuide"
  | "noContributing"
  | "rateLimitError"
  | "notFoundError"
  | "invalidApiKeyError"
  | "unsupportedLanguageError"
  | "networkError"
  | "noAnthropicKey"
  | "fork"
  | "clone"
  | "configRemote"
  | "createBranch"
  | "installDeps"
  | "reproduce"
  | "makeChanges"
  | "sync"
  | "push"
  | "openPR"
  | "hintsTitle"
  | "wantMoreHints"
  | "language";

const translations: Record<SupportedLang, Record<TranslationKey, string>> = {
  en: {
    searchResults: "Open issues in {language} ({count} results)",
    noResults: "No issues found for {language} with the selected filters.",
    daysAgo: "{n} days ago",
    hoursAgo: "{n} hours ago",
    minutesAgo: "{n} minutes ago",
    justNow: "just now",
    issueDetail: "ISSUE DETAIL",
    explanation: "EXPLANATION",
    contributionGuide: "CONTRIBUTION GUIDE",
    hints: "HINTS",
    step: "STEP",
    stars: "stars",
    labels: "Labels",
    author: "Author",
    created: "Created",
    state: "State",
    open: "Open",
    closed: "Closed",
    comments: "comments",
    relevantComments: "RELEVANT COMMENTS",
    officialGuide: "OFFICIAL CONTRIBUTING GUIDE",
    noContributing: "No CONTRIBUTING.md found in this repository.",
    rateLimitError: "GitHub rate limit reached. Wait {seconds} seconds or configure GITHUB_TOKEN.",
    notFoundError: "Issue not found. Check that the URL is correct.",
    invalidApiKeyError: "Invalid ANTHROPIC_API_KEY. Check your .env or MCP configuration.",
    unsupportedLanguageError: "'{lang}' is not supported. Available languages: {list}",
    networkError: "Could not connect to GitHub. Check your internet connection.",
    noAnthropicKey: "ANTHROPIC_API_KEY is not set. explain_issue and get_hints require it.",
    fork: "Fork the repository",
    clone: "Clone your fork",
    configRemote: "Configure upstream remote",
    createBranch: "Create a branch for your work",
    installDeps: "Install project dependencies",
    reproduce: "Reproduce the problem",
    makeChanges: "Make your changes",
    sync: "Sync with upstream before PR",
    push: "Push your branch",
    openPR: "Open the Pull Request",
    hintsTitle: "HINTS FOR SOLVING THE ISSUE",
    wantMoreHints: "Want hint {next}? Ask me \"give me hint {next} for this issue\".",
    language: "Language",
  },
  es: {
    searchResults: "Issues abiertas en {language} ({count} resultados)",
    noResults: "No se encontraron issues para {language} con los filtros seleccionados.",
    daysAgo: "Hace {n} días",
    hoursAgo: "Hace {n} horas",
    minutesAgo: "Hace {n} minutos",
    justNow: "ahora mismo",
    issueDetail: "DETALLE DE ISSUE",
    explanation: "EXPLICACIÓN",
    contributionGuide: "GUÍA DE CONTRIBUCIÓN",
    hints: "PISTAS",
    step: "PASO",
    stars: "estrellas",
    labels: "Etiquetas",
    author: "Autor",
    created: "Creada",
    state: "Estado",
    open: "Abierta",
    closed: "Cerrada",
    comments: "comentarios",
    relevantComments: "COMENTARIOS RELEVANTES",
    officialGuide: "GUÍA OFICIAL DE CONTRIBUCIÓN",
    noContributing: "No se encontró CONTRIBUTING.md en este repositorio.",
    rateLimitError: "Rate limit de GitHub alcanzado. Espera {seconds} segundos o configura GITHUB_TOKEN.",
    notFoundError: "No se encontró la issue. Verifica que la URL sea correcta.",
    invalidApiKeyError: "ANTHROPIC_API_KEY inválida. Verifica tu .env o la configuración MCP.",
    unsupportedLanguageError: "'{lang}' no está soportado. Lenguajes disponibles: {list}",
    networkError: "No se pudo conectar a GitHub. Verifica tu conexión a internet.",
    noAnthropicKey: "ANTHROPIC_API_KEY no está configurada. explain_issue y get_hints la requieren.",
    fork: "Fork del repositorio",
    clone: "Clona tu fork",
    configRemote: "Configura el remote upstream",
    createBranch: "Crea una rama para tu trabajo",
    installDeps: "Instala las dependencias del proyecto",
    reproduce: "Reproduce el problema",
    makeChanges: "Haz tus cambios",
    sync: "Sincroniza con upstream antes del PR",
    push: "Sube tu rama",
    openPR: "Abre el Pull Request",
    hintsTitle: "PISTAS PARA RESOLVER LA ISSUE",
    wantMoreHints: "¿Quieres la pista {next}? Pídeme \"dame la pista {next} para esta issue\".",
    language: "Lenguaje",
  },
  pt: {
    searchResults: "Issues abertas em {language} ({count} resultados)",
    noResults: "Nenhuma issue encontrada para {language} com os filtros selecionados.",
    daysAgo: "Há {n} dias",
    hoursAgo: "Há {n} horas",
    minutesAgo: "Há {n} minutos",
    justNow: "agora mesmo",
    issueDetail: "DETALHE DA ISSUE",
    explanation: "EXPLICAÇÃO",
    contributionGuide: "GUIA DE CONTRIBUIÇÃO",
    hints: "DICAS",
    step: "PASSO",
    stars: "estrelas",
    labels: "Etiquetas",
    author: "Autor",
    created: "Criada",
    state: "Estado",
    open: "Aberta",
    closed: "Fechada",
    comments: "comentários",
    relevantComments: "COMENTÁRIOS RELEVANTES",
    officialGuide: "GUIA OFICIAL DE CONTRIBUIÇÃO",
    noContributing: "Nenhum CONTRIBUTING.md encontrado neste repositório.",
    rateLimitError: "Rate limit do GitHub atingido. Aguarde {seconds} segundos ou configure GITHUB_TOKEN.",
    notFoundError: "Issue não encontrada. Verifique se a URL está correta.",
    invalidApiKeyError: "ANTHROPIC_API_KEY inválida. Verifique seu .env ou configuração MCP.",
    unsupportedLanguageError: "'{lang}' não é suportado. Linguagens disponíveis: {list}",
    networkError: "Não foi possível conectar ao GitHub. Verifique sua conexão com a internet.",
    noAnthropicKey: "ANTHROPIC_API_KEY não está configurada. explain_issue e get_hints precisam dela.",
    fork: "Faça o fork do repositório",
    clone: "Clone seu fork",
    configRemote: "Configure o remote upstream",
    createBranch: "Crie uma branch para seu trabalho",
    installDeps: "Instale as dependências do projeto",
    reproduce: "Reproduza o problema",
    makeChanges: "Faça suas alterações",
    sync: "Sincronize com upstream antes do PR",
    push: "Envie sua branch",
    openPR: "Abra o Pull Request",
    hintsTitle: "DICAS PARA RESOLVER A ISSUE",
    wantMoreHints: "Quer a dica {next}? Peça \"me dê a dica {next} para esta issue\".",
    language: "Linguagem",
  },
  it: {
    searchResults: "Issue aperte in {language} ({count} risultati)",
    noResults: "Nessuna issue trovata per {language} con i filtri selezionati.",
    daysAgo: "{n} giorni fa",
    hoursAgo: "{n} ore fa",
    minutesAgo: "{n} minuti fa",
    justNow: "proprio adesso",
    issueDetail: "DETTAGLIO ISSUE",
    explanation: "SPIEGAZIONE",
    contributionGuide: "GUIDA AL CONTRIBUTO",
    hints: "SUGGERIMENTI",
    step: "PASSO",
    stars: "stelle",
    labels: "Etichette",
    author: "Autore",
    created: "Creata",
    state: "Stato",
    open: "Aperta",
    closed: "Chiusa",
    comments: "commenti",
    relevantComments: "COMMENTI RILEVANTI",
    officialGuide: "GUIDA UFFICIALE AL CONTRIBUTO",
    noContributing: "Nessun CONTRIBUTING.md trovato in questo repository.",
    rateLimitError: "Rate limit di GitHub raggiunto. Attendi {seconds} secondi o configura GITHUB_TOKEN.",
    notFoundError: "Issue non trovata. Verifica che l'URL sia corretto.",
    invalidApiKeyError: "ANTHROPIC_API_KEY non valida. Controlla il tuo .env o la configurazione MCP.",
    unsupportedLanguageError: "'{lang}' non è supportato. Linguaggi disponibili: {list}",
    networkError: "Impossibile connettersi a GitHub. Controlla la connessione internet.",
    noAnthropicKey: "ANTHROPIC_API_KEY non è configurata. explain_issue e get_hints ne hanno bisogno.",
    fork: "Fork del repository",
    clone: "Clona il tuo fork",
    configRemote: "Configura il remote upstream",
    createBranch: "Crea un branch per il tuo lavoro",
    installDeps: "Installa le dipendenze del progetto",
    reproduce: "Riproduci il problema",
    makeChanges: "Apporta le modifiche",
    sync: "Sincronizza con upstream prima della PR",
    push: "Carica il tuo branch",
    openPR: "Apri la Pull Request",
    hintsTitle: "SUGGERIMENTI PER RISOLVERE L'ISSUE",
    wantMoreHints: "Vuoi il suggerimento {next}? Chiedimi \"dammi il suggerimento {next} per questa issue\".",
    language: "Linguaggio",
  },
};

export function t(
  lang: SupportedLang,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  let text = translations[lang]?.[key] ?? translations["en"][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export function timeAgo(dateStr: string, lang: SupportedLang): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return t(lang, "justNow");
  if (diffMins < 60) return t(lang, "minutesAgo", { n: diffMins });
  if (diffHours < 24) return t(lang, "hoursAgo", { n: diffHours });
  return t(lang, "daysAgo", { n: diffDays });
}
