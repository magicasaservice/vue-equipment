import type { MCheckboxMode, MCheckboxSize } from '../types/checkbox'

/**
 * Every class Mirror v1’s `checkbox.css` reached through a component token,
 * expressed in v2’s generated utilities.
 *
 * The strings are written out in full because Tailwind reads them literally,
 * and the component composes them so exactly one utility per CSS property
 * reaches an element. v1 painted `:checked` and `:indeterminate` with the same
 * tokens, and this component knows both from `modelValue`, so the checked
 * colour is a branch in script rather than a `data-[state=…]:` variant.
 *
 * The label colour sits on the root rather than on the label element: the
 * `label` slot takes arbitrary content, which no class of ours can reach, and
 * `color` inherits. Its type ramp is in the CSS block for the same reason.
 *
 * Two deliberate deviations. v2’s `Checkbox.Root` does not track a pressed
 * state, so v1’s `:active` rules stay the CSS pseudo-class, as Tailwind’s
 * `active:` variant. Tailwind emits that variant after `focus-visible:`, so a
 * focused box held down shows the pressed border rather than the focus one;
 * the focus outline is unaffected, since `active:` sets no outline colour.
 * And v1’s unchecked danger border read the *background* token at that step,
 * which no border utility names, so it reads the border token instead.
 */

/** Shape and motion of the row. Carries no colour, no size, no direction. */
export const checkboxBase = 'm-checkbox inline-flex items-start select-none'

/** v1: `cursor` on the row, replaced wholesale while disabled. */
export const checkboxCursor = 'cursor-pointer'

export const checkboxDisabledCursor = 'cursor-not-allowed'

/** v1: `&.-reverse { flex-direction: row-reverse }`. */
export const checkboxDirection = 'flex-row'

export const checkboxReverseDirection = 'flex-row-reverse'

/** v1: `dimension.gap`. */
export const checkboxGap: Record<MCheckboxSize, string> = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

/** v1: `color.label.default.<mode>.fg`, inherited by the label content. */
export const checkboxLabelColor: Record<MCheckboxMode, string> = {
  solid: 'text-primary-solid',
  subtle: 'text-primary-subtle',
}

/** v1: `color.label.disabled.<mode>.fg`. Replaces the mode colour. */
export const checkboxLabelDisabledColor: Record<MCheckboxMode, string> = {
  solid: 'text-disabled-solid',
  subtle: 'text-disabled-subtle',
}

/** v1: `color.label.danger.fg`. Replaces the mode colour. */
export const checkboxLabelDangerColor = 'text-danger-solid'

/** Shape, motion and focus of the box. Carries no colour and no size. */
export const checkboxBoxBase =
  'm-checkbox__input relative box-border flex shrink-0 items-center justify-center border-2 outline-4 outline-offset-0 outline-transparent transition-all duration-100 ease-linear focus-visible:focus-ring'

/** v1: `dimension.input.height`, `dimension.input.width`, `dimension.input.radius`. */
export const checkboxBoxSize: Record<MCheckboxSize, string> = {
  sm: 'size-4 rounded-component-compact-sm',
  md: 'size-5 rounded-component-compact-md',
  lg: 'size-6 rounded-component-compact-lg',
}

/** v1: `color.input.unchecked.default`. */
export const checkboxBoxColor =
  'border-primary-muted bg-transparent text-transparent active:border-primary-muted-active'

/** v1: `color.input.checked.default`, shared by the mixed state. */
export const checkboxBoxCheckedColor =
  'border-transparent bg-accent-solid text-accent-on-solid active:bg-accent-solid-active'

/** v1: `color.input.unchecked.danger`, which `error` turns on. */
export const checkboxBoxDangerColor =
  'border-danger-muted bg-danger-subtle text-transparent active:border-danger-muted-active active:bg-danger-subtle-active'

/** v1: `color.input.checked.danger`. */
export const checkboxBoxCheckedDangerColor =
  'border-transparent bg-danger-solid text-danger-on-solid active:bg-danger-solid-active'

/** v1: `color.input.unchecked.disabled`. Replaces the variant, error included. */
export const checkboxBoxDisabledColor =
  'border-disabled-subtle bg-transparent text-transparent'

/** v1: `color.input.checked.disabled`. */
export const checkboxBoxCheckedDisabledColor =
  'border-transparent bg-disabled-solid text-disabled-on-solid'
