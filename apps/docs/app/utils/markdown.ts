/**
 * Inline markdown, and only inline markdown. A reference table cell is a
 * phrase, never a document: a name, a type, a sentence with a link in it. The
 * grammar an author actually writes there is `code`, [links](/to/a/page),
 * **strong** and *emphasis*, so that is the whole grammar this reads.
 *
 * Everything is HTML-escaped before it is read, so a type union renders as it
 * was written without an escape hatch of its own.
 */

const entities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
}

export function escapeHtml(source: string | number | boolean): string {
  // Front matter hands over whatever YAML parsed: an unquoted 0 or true is a
  // number or a boolean, and a cell is a phrase either way.
  return String(source).replace(/[&<>"]/g, (character) => entities[character]!)
}

// Relative, absolute, anchor and mail. A URL in any other scheme is left as
// the text it was written as rather than turned into a link.
const linkable = /^(?:https?:\/\/|mailto:|\/|#|\.)/

// A code span is parked behind this marker while the rest of the phrase is
// read. It is a private-use character, and it is stripped from the source
// first, so it can never survive into the output and be read back as one.
const marker = /\uE000/g

const code = /`([^`]+)`/g
const parked = /\uE000(\d+)\uE000/g
const link = /\[([^\]]+)\]\(([^\s)]+)\)/g
const strong = /\*\*([^*]+)\*\*/g
const emphasis = /(^|[^*])\*([^*\s][^*]*)\*/g

export function renderInlineMarkdown(
  source: string | number | boolean
): string {
  source = String(source)
  const spans: Array<string> = []

  // Code is read first: what is inside a span is literal, so it is taken out
  // and put back once everything around it has been read.
  let html = escapeHtml(source.replace(marker, '')).replace(
    code,
    (_match, span: string) => {
      spans.push(span)
      return `\uE000${spans.length - 1}\uE000`
    }
  )

  html = html
    .replace(link, (match, label: string, href: string) => {
      if (!linkable.test(href)) {
        return match
      }
      const attributes = href.startsWith('http')
        ? ' target="_blank" rel="noopener noreferrer"'
        : ''
      return `<a class="docs-link" href="${href}"${attributes}>${label}</a>`
    })
    .replace(strong, '<strong>$1</strong>')
    .replace(emphasis, '$1<em>$2</em>')

  return html.replace(
    parked,
    (_match, index: string) =>
      `<code class="docs-inline-code">${spans[Number(index)]}</code>`
  )
}

/** The same phrase with its markup taken off, for a label a screen reader reads. */
export function plainMarkdown(source: string | number | boolean): string {
  source = String(source)
  return source
    .replace(code, '$1')
    .replace(link, '$1')
    .replace(strong, '$1')
    .replace(emphasis, '$1$2')
}
