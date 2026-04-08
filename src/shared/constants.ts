import type { SupportedLang } from "./types.js";

export const PRIMARY_LANGUAGES = [
  "java",
  "python",
  "javascript",
  "typescript",
  "go",
  "rust",
  "cpp",
  "csharp",
  "c",
  "kotlin",
  "swift",
] as const;

export const SECONDARY_LANGUAGES = [
  "ruby", "php", "scala", "elixir", "dart", "shell",
] as const;

export const SUPPORTED_LANGUAGES = [...PRIMARY_LANGUAGES, ...SECONDARY_LANGUAGES] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_QUERY_MAP: Record<string, string> = {
  java:         "Java",
  python:       "Python",
  javascript:   "JavaScript",
  typescript:   "TypeScript",
  go:           "Go",
  rust:         "Rust",
  cpp:          "C++",
  "c++":        "C++",
  csharp:       "C#",
  "c#":         "C#",
  c:            "C",
  kotlin:       "Kotlin",
  swift:        "Swift",
  ruby:         "Ruby",
  php:          "PHP",
  scala:        "Scala",
  elixir:       "Elixir",
  dart:         "Dart",
  shell:        "Shell",
};

export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  cpp:    "C++",
  csharp: "C#",
};

export function normalizeLanguage(input: string): string | null {
  const lower = input.toLowerCase().trim();
  if (LANGUAGE_QUERY_MAP[lower]) return lower;
  return null;
}

export function getLanguageDisplayName(lang: string): string {
  return LANGUAGE_DISPLAY_NAMES[lang] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

export const SUPPORTED_LANGUAGES_LIST = [
  ...PRIMARY_LANGUAGES.map(getLanguageDisplayName),
  ...SECONDARY_LANGUAGES.map(getLanguageDisplayName),
].join(", ");

export const LANGUAGE_NAME_FOR_PROMPT: Record<SupportedLang, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
  it: "Italian",
};
