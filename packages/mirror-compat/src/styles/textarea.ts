import type { MTextareaSize } from '../types/textarea'

/**
 * Textarea keeps even less in utilities than Input does.
 *
 * Its chrome is an `outline` with a negative offset, so the box never grows
 * when the ring appears, and the generated utilities cover background, text,
 * border and divide colour but not outline colour. The float-label mechanics
 * and the growing height are structural selectors on top of that. Both live in
 * the component’s CSS block, reading the same application variables the
 * utilities read.
 *
 * What is left here is the box: display, width and radius. Height is not a
 * ramp of fixed values but a min and a max on the scroll container, so it sits
 * in the CSS block with the rest of the size ramp.
 */

/** Shape and motion. Carries no size. */
export const textareaBase =
  'm-textarea relative box-border flex w-full cursor-text flex-row items-start justify-start select-none transition-all duration-100 ease-linear'

/** v1: `dimension.radius`, one step up the app radius ramp per size. */
export const textareaRadius: Record<MTextareaSize, string> = {
  xs: 'rounded-component-sm',
  sm: 'rounded-component-md',
  md: 'rounded-component-lg',
  lg: 'rounded-component-xl',
}
