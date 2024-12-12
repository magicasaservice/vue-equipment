// This implementation is meant for internal use only.
// It is only used to generate a unique IDs for the `key` props.
// It should not replace crypto.randomUUID() or window.crypto.randomUUID().

export function uuid() {
  console.warn('uuid() is deprecated, use vue.useId() instead')

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .split('')
    .reduce(
      (c, i) =>
        c +
        (i === 'x'
          ? Math.floor(Math.random() * 0xf).toString(16)
          : i === 'y'
            ? Math.floor(Math.random() * 4 + 8).toString(16)
            : i),
      ''
    )
}
