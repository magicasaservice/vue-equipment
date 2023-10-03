export interface SlugifyOptions {
  separator?: string
  trim?: boolean
  remove?: RegExp
  strict?: boolean
  lowercase?: boolean
}

const defaultOptions: SlugifyOptions = {
  separator: '-',
  trim: true,
  remove: undefined,
  strict: true,
  lowercase: true,
}

export function slugify(string: string, options?: SlugifyOptions): string {
  if (typeof string !== 'string') {
    throw new Error('slugify: string argument expected')
  }

  // Merge provided options with default options
  const _options = { ...defaultOptions, ...options }

  const charMap: { [key: string]: string } = {}

  let slug = string
    .normalize()
    .split('')
    .reduce(function (result, ch) {
      let appendChar = charMap[ch]
      if (appendChar === undefined) appendChar = ch
      if (appendChar === _options?.separator) appendChar = ' '
      return (
        result +
        appendChar.replace(_options?.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, '')
      )
    }, '')

  if (_options.strict) {
    slug = slug.replace(/[^A-Za-z0-9\s]/g, '')
  }

  if (_options.trim) {
    slug = slug.trim()
  }

  if (_options.separator) {
    slug = slug.replace(/ +/g, _options.separator)
  }

  if (_options.lowercase) {
    slug = slug.toLocaleLowerCase()
  }

  return slug
}
