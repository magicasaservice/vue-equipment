// Converts a CSS length string in `px` or `rem` to an absolute pixel value.
// Returns undefined for any other unit or an unparseable value, so callers can
// warn with their own context.
export function convertToPixels(value: string): number | undefined {
  const match = value.trim().match(/^(\d*\.?\d+)\s*(rem|px)$/)
  if (!match) {
    return undefined
  }

  const numericValue = parseFloat(match[1] ?? '')

  if (match[2] === 'rem') {
    const rootFontSize =
      parseFloat(getComputedStyle(document.body).fontSize) || 16
    return numericValue * rootFontSize
  }

  return numericValue
}
