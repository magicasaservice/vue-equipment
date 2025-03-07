export function scrollbarWidth() {
  // Create div with a scrollbar
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)

  // Create inner div
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Get width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // Clean up
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}
