export function uniq<T extends unknown[]>(a: T) {
  return Array.from(new Set(a))
}
