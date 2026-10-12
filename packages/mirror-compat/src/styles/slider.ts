/**
 * Mirror v1’s `slider.css`, as far as the generated utilities reach.
 *
 * They do not reach far here. Almost every colour v1 gave the slider is a
 * *foreground* token used as a background: the filled track, the handle and
 * both step colours all read `fg.solid`, `fg.onSolid` or `fg.subtle`, and no
 * `bg-` utility names those. Those four stay in the component’s CSS block,
 * reading the same `--app-*` variables the utilities read. What is left here
 * is the box: the row, the resting track, the radii and the motion.
 *
 * The handle and the step dots are sized from public custom properties rather
 * than utilities, because the apps override those dimensions per app.
 */

/** v1: `.m-slider`. */
export const sliderBase = 'm-slider w-full select-none'

/** v1: `.m-slider__container`, `dimension.container.height`. */
export const sliderControl = 'm-slider__container flex h-8 w-full items-center'

/** v1: `.m-slider-track__container`, `color.default.track.bg.inactive`. */
export const sliderTrack =
  'm-slider__track rounded-component-round bg-primary-subtle transition-all duration-100 ease-linear'

/** v1: `color.disabled.track.bg.inactive`. Replaces the resting colour. */
export const sliderDisabledTrack =
  'm-slider__track rounded-component-round bg-disabled-subtle transition-all duration-100 ease-linear'

/** v1: `.m-slider-range__fill`. Its colour is a foreground token, so it is in CSS. */
export const sliderIndicator =
  'm-slider__range rounded-component-round transition-all duration-100 ease-linear'

/** v1: `.m-slider-handle`, the box the offset moved. */
export const sliderThumb = 'm-slider__handle'

/** v1: `.m-slider-handle__fill`, `dimension.handle.radius`. */
export const sliderHandle =
  'm-slider__handle-fill rounded-component-lg transition-all duration-100 ease-linear'

/** v1: `.m-slider-steps`, and the same element again inside the filled range. */
export const sliderSteps = 'm-slider__steps'

/** v1: `.m-slider__target`, the hit area that reaches past the track. */
export const sliderTarget = 'm-slider__target'
