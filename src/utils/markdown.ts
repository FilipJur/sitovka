import { marked } from "marked";

/**
 * Convert markdown string to HTML
 * Simple wrapper around marked.parse for consistent usage
 */
export function mdToHtml(markdown: string | null | undefined): string {
  if (!markdown) return "";
  return marked.parse(markdown, { async: false }) as string;
}
