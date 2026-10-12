<template>
  <mirror-toggle-root
    :id="mappedId"
    :aria-pressed="checked"
    :class="classes"
    :data-icon-checked="iconChecked || undefined"
    :data-icon-unchecked="iconUnchecked || undefined"
    :data-mode="mode"
    :data-pressed="checked || undefined"
    :data-reverse="reverse || undefined"
    :data-size="size"
    :data-state="checked ? 'on' : 'off'"
    :disabled="disabled"
    :model-value="checked"
    @update:model-value="handleChange"
  >
    <span class="m-toggle__checkbox">
      <span :class="[toggleTrackBase, trackColor]" />
      <span :class="[toggleHandleBase, handleColor]">
        <span v-if="slots.checked && checked">
          <slot name="checked" />
        </span>
        <span v-if="slots.unchecked && !checked">
          <slot name="unchecked" />
        </span>
      </span>
    </span>
    <slot name="label">
      <span v-if="label">{{ label }}</span>
    </slot>
  </mirror-toggle-root>
</template>

<script lang="ts" setup>
import { computed, useId, useSlots } from 'vue'
import { ToggleRoot as MirrorToggleRoot } from '@maas/mirror/vue/Toggle'
import {
  toggleBase,
  toggleGap,
  toggleHandleBase,
  toggleHandleColor,
  toggleHandleDisabledColor,
  toggleTrackBase,
  toggleTrackColor,
  toggleTrackDisabledColor,
} from '../styles/toggle'

import type { MToggleProps } from '../types/toggle'

const {
  modelValue = false,
  id = '',
  label = '',
  mode = 'solid',
  size = 'md',
  reverse = false,
  iconChecked = false,
  iconUnchecked = false,
  disabled = false,
} = defineProps<MToggleProps>()

// v1 declared `blur` and `focus` and never emitted either. They are kept in
// the signature so an existing listener still compiles, and they stay silent.
const emit = defineEmits<{
  (e: 'update:modelValue', value: MToggleProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

const slots = useSlots()

const classes = computed(() => [toggleBase, toggleGap[size]])

// Generated once during setup: `useId` reads the current instance, so calling
// it inside a computed returns a new id on every re-evaluation.
const generatedId = useId()

const mappedId = computed(() => id || generatedId)

// v1 bound `indeterminate` to a checkbox, where anything truthy reads as
// checked. `Toggle.Root` takes a boolean, so the third state resolves the same
// way on the way in and leaves as the boolean the user just set.
const checked = computed(() => !!modelValue)

/*
 * The prop is the state, and the part supplies the behaviour.
 *
 * `Toggle.Root` keeps a copy of the value and writes `aria-pressed`,
 * `data-pressed` and `data-state` from it. Those three are written here
 * instead, from the prop, and the next value is this component's own negation
 * rather than the payload, so what the box draws is what the call site holds.
 * The part still gets the value, so the two agree; it just does not get the
 * last word on a control whose model lives one level up.
 */
const trackColor = computed(() =>
  disabled
    ? toggleTrackDisabledColor[checked.value ? 'on' : 'off']
    : toggleTrackColor[checked.value ? 'on' : 'off']
)

const handleColor = computed(() =>
  disabled
    ? toggleHandleDisabledColor[checked.value ? 'on' : 'off']
    : toggleHandleColor[checked.value ? 'on' : 'off']
)

function handleChange() {
  emit('update:modelValue', !checked.value)
}
</script>

<style>
/*
 * The port of v1’s `toggle.css`. Component tokens become the application
 * variables they resolved to, and the modifier classes become the data
 * attributes the wrapper writes.
 *
 * Two things change owner. The control is a `<button>` rather than a `<label>`
 * around a checkbox, so `:checked` is `data-state='on'` and `:disabled` is
 * `data-disabled`, both written by `Toggle.Root`. And v1’s `:active` squish
 * has no data attribute in v2, so it stays the CSS pseudo-class it always was.
 *
 * Unscoped, and every selector rooted at `.m-toggle`, because the `label` slot
 * carries the parent’s scope id rather than this component’s.
 */
.m-toggle {
  --m-toggle-track-height: calc(var(--spacing) * 6);
  --m-toggle-handle-inset: calc(var(--spacing) * 0.75);
  --m-toggle-handle-padding: calc(var(--spacing) * 0.5);
  --m-toggle-handle-press: var(--spacing);
  --m-toggle-font-size-label: var(--app-font-size-text-xs);

  /* v1 derived all three from the two above, and so does this. */
  --m-toggle-handle-size: calc(
    var(--m-toggle-track-height) - var(--m-toggle-handle-inset) * 2
  );
  --m-toggle-handle-size-pressed: calc(
    var(--m-toggle-handle-size) + var(--m-toggle-handle-press)
  );
  --m-toggle-track-width: calc(
    var(--m-toggle-handle-size) * 2 + var(--m-toggle-handle-inset) * 2
  );
}

.m-toggle[data-size='sm'] {
  --m-toggle-track-height: calc(var(--spacing) * 4.5);
  --m-toggle-handle-inset: calc(var(--spacing) * 0.5);
  --m-toggle-handle-padding: calc(var(--spacing) * 0.25);
  --m-toggle-handle-press: calc(var(--spacing) * 0.5);
  --m-toggle-font-size-label: var(--app-font-size-text-2xs);
}

.m-toggle[data-size='md'] {
  --m-toggle-track-height: calc(var(--spacing) * 6);
  --m-toggle-handle-inset: calc(var(--spacing) * 0.75);
  --m-toggle-handle-padding: calc(var(--spacing) * 0.5);
  --m-toggle-handle-press: var(--spacing);
  --m-toggle-font-size-label: var(--app-font-size-text-xs);
}

.m-toggle[data-size='lg'] {
  --m-toggle-track-height: calc(var(--spacing) * 7.5);
  --m-toggle-handle-inset: calc(var(--spacing) * 0.75);
  --m-toggle-handle-padding: calc(var(--spacing) * 0.5);
  --m-toggle-handle-press: calc(var(--spacing) * 1.5);
  --m-toggle-font-size-label: var(--app-font-size-text-sm);
}

.m-toggle[data-reverse='true'] {
  flex-direction: row-reverse;
}

.m-toggle .m-toggle__checkbox {
  position: relative;
  display: inline-flex;
  height: var(--m-toggle-track-height);
  width: var(--m-toggle-track-width);
  flex-shrink: 0;
}

.m-toggle .m-toggle__handle {
  position: absolute;
  z-index: 1;
  top: var(--m-toggle-handle-inset);
  left: var(--m-toggle-handle-inset);
  height: var(--m-toggle-handle-size);
  width: var(--m-toggle-handle-size);
  padding: var(--m-toggle-handle-padding);
  box-shadow: 0 calc(var(--spacing) * 0.25) 0.125rem
    var(--app-color-surface-shadow);
}

.m-toggle .m-toggle__handle * {
  height: 100%;
  width: 100%;
}

.m-toggle[data-state='on'] .m-toggle__handle {
  transform: translateX(
    calc(
      var(--m-toggle-track-width) - var(--m-toggle-handle-size) -
        var(--m-toggle-handle-inset) * 2
    )
  );
}

/*
 * The squish. `Toggle.Root` writes `data-pressed` for the on state rather than
 * for a pointer being down, so the press is read from `:active` on the control
 * itself, which is what v1 read on the checkbox.
 */
.m-toggle:active:not([data-disabled='true']) .m-toggle__handle {
  width: var(--m-toggle-handle-size-pressed);
  box-shadow: 0 calc(var(--spacing) * 0.25) 0.125rem
    var(--app-color-surface-shadow-strong);
}

.m-toggle[data-state='on']:active:not([data-disabled='true'])
  .m-toggle__handle {
  transform: translateX(
    calc(
      var(--m-toggle-track-width) - var(--m-toggle-handle-size-pressed) -
        var(--m-toggle-handle-inset) * 2
    )
  );
}

.m-toggle > span:not(.m-toggle__checkbox) {
  display: block;
  font-family: var(--app-font-family-text);
  font-size: var(--m-toggle-font-size-label);
  font-weight: var(--app-font-weight-text);
  line-height: var(--app-line-height);
  transition: all 100ms linear;
}

/* Resting label colour. The disabled block below overrides it. */
.m-toggle[data-mode='solid'] > span:not(.m-toggle__checkbox) {
  color: var(--app-color-primary-fg-solid);
}

.m-toggle[data-mode='subtle'] > span:not(.m-toggle__checkbox) {
  color: var(--app-color-primary-fg-subtle);
}

.m-toggle[data-disabled='true'][data-mode='solid']
  > span:not(.m-toggle__checkbox) {
  color: var(--app-color-disabled-fg-solid);
}

.m-toggle[data-disabled='true'][data-mode='subtle']
  > span:not(.m-toggle__checkbox) {
  color: var(--app-color-disabled-fg-subtle);
}
</style>
