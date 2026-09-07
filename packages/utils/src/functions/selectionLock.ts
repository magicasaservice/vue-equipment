let lockCount = 0
let previousUserSelect = ''
let previousWebkitUserSelect = ''

function onSelectstart(event: Event) {
  event.preventDefault()
}

// Blocks text selection page-wide, e.g. for the duration of a drag.
export function lockSelection(): () => void {
  if (typeof document === 'undefined') {
    return () => {}
  }

  if (lockCount === 0) {
    const { style } = document.documentElement
    previousUserSelect = style.userSelect
    previousWebkitUserSelect = style.webkitUserSelect
    style.userSelect = 'none'
    style.webkitUserSelect = 'none'
    document.addEventListener('selectstart', onSelectstart)
  }

  lockCount++

  let released = false

  return function releaseSelection() {
    if (released) {
      return
    }

    released = true
    lockCount--

    if (lockCount === 0) {
      const { style } = document.documentElement
      style.userSelect = previousUserSelect
      style.webkitUserSelect = previousWebkitUserSelect
      document.removeEventListener('selectstart', onSelectstart)
    }
  }
}
