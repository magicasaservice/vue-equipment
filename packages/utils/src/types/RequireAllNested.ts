// Deeply require every property. Functions are treated as leaves, otherwise
// recursing into their call signature would strip it and leave them uncallable.
export type RequireAllNested<T> = {
  [P in keyof T]-?: NonNullable<T[P]> extends (...args: never[]) => unknown
    ? NonNullable<T[P]>
    : RequireAllNested<T[P]>
}
