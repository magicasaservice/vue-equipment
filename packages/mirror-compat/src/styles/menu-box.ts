/**
 * Mirror v1’s `menu-box.css`, expressed in v2’s generated utilities.
 *
 * The strings are written out in full because Tailwind reads them literally,
 * and no two utilities here set the same CSS property.
 *
 * The radius is missing on purpose. v1 resolved it as
 * `radius.default.<size> + padding.x`, which is a calc rather than a step on
 * the radius ramp, so it lives in the component’s CSS block instead.
 */

/**
 * Shape and chrome. The radius, the blur and the shadow are in the CSS block,
 * the shadow because call sites turn it off through `--m-menu-box-shadow`.
 */
export const menuBoxBase =
  'm-menu-box box-border list-none border-2 border-transparent bg-primary-inverted p-1'
