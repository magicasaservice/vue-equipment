export function matchClass(el: Element, regex: RegExp) {
  return Array.from(el.classList).some((className) => regex.test(className))
}
