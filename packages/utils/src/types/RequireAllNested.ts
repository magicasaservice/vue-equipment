export type RequireAllNested<T> = {
  [P in keyof T]-?: RequireAllNested<T[P]>
}
