// How much an ancestor’s transform or zoom scales the element on screen
export function measureScale(el: HTMLElement): number {
  const styles = window.getComputedStyle(el)

  const frame =
    parseFloat(styles.paddingLeft) +
    parseFloat(styles.paddingRight) +
    parseFloat(styles.borderLeftWidth) +
    parseFloat(styles.borderRightWidth)

  // The computed width keeps the fractions offsetWidth rounds away
  const width =
    parseFloat(styles.width) + (styles.boxSizing === 'border-box' ? 0 : frame)

  return el.getBoundingClientRect().width / width || 1
}
