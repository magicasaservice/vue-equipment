/**
 * Two Shiki themes drawn from the Mirror ramp, so a code block on this site is
 * colored by the same palette the site documents rather than by GitHub's.
 *
 * Six token colors, one per role, taken from the `blue`, `green`, `yellow`,
 * `red` and `grey` families in `.maas/tokens/css/config.css`. Light picks the
 * 9th or 10th step and dark the 5th, which puts every one of them between
 * 5.2:1 and 8:1 against `surface-bg-high` in its own mode. The backgrounds are
 * transparent: `main.css` lets the block's own panel show through so code and
 * every other quiet region share one ground.
 */

interface TokenColor {
  scope: Array<string>
  settings: { foreground: string; fontStyle?: string }
}

interface MirrorTheme {
  name: string
  type: 'light' | 'dark'
  colors: Record<string, string>
  settings: Array<TokenColor | { settings: { foreground: string } }>
  tokenColors: Array<TokenColor>
}

const scopes = {
  comment: ['comment', 'punctuation.definition.comment', 'string.comment'],
  keyword: [
    'keyword',
    'storage',
    'storage.type',
    'keyword.control',
    'keyword.operator',
    'punctuation.definition.keyword',
    'variable.language',
    'markup.heading',
  ],
  string: [
    'string',
    'string.quoted',
    'string.template',
    'punctuation.definition.string',
    'markup.inserted',
  ],
  constant: [
    'constant',
    'constant.numeric',
    'constant.language',
    'support.constant',
    'entity.other.attribute-name',
    'markup.bold',
  ],
  entity: [
    'entity.name.function',
    'entity.name.tag',
    'entity.name.type',
    'support.function',
    'support.class',
    'support.type',
    'markup.deleted',
  ],
  ink: [
    'source',
    'variable',
    'variable.other',
    'meta.object-literal.key',
    'punctuation',
    'support.variable',
  ],
}

function build(
  name: string,
  type: 'light' | 'dark',
  palette: Record<keyof typeof scopes, string>
): MirrorTheme {
  const tokenColors: Array<TokenColor> = (
    Object.keys(scopes) as Array<keyof typeof scopes>
  ).map((role) => ({
    scope: scopes[role],
    settings: {
      foreground: palette[role],
      ...(role === 'comment' ? { fontStyle: 'italic' } : {}),
    },
  }))

  return {
    name,
    type,
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': palette.ink,
    },
    settings: [{ settings: { foreground: palette.ink } }, ...tokenColors],
    tokenColors,
  }
}

export const mirrorLight = build('mirror-light', 'light', {
  ink: '#2a2b2e',
  comment: '#65686e',
  keyword: '#3161d2',
  string: '#00792d',
  constant: '#6d5604',
  entity: '#c23210',
})

export const mirrorDark = build('mirror-dark', 'dark', {
  ink: '#d6d7db',
  comment: '#96989d',
  keyword: '#8db1f9',
  string: '#70c285',
  constant: '#c4af76',
  entity: '#ff947a',
})
