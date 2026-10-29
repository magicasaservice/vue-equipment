<template>
  <mirror-select-root
    :id="instanceId"
    :default-value="mappedValue"
    :options="rootOptions"
    @update:model-value="handleChange"
  >
    <mirror-select-trigger
      ref="triggerRef"
      :aria-disabled="disabled"
      :aria-invalid="error"
      :aria-required="required"
      :aria-valuenow="mappedValue ?? undefined"
      :class="classes"
      :data-blur="blur || undefined"
      :data-error="error || undefined"
      :data-icon-end="iconEnd || undefined"
      :data-icon-start="iconStart || undefined"
      :data-simple="simple || undefined"
      :data-size="size"
      :data-slot-end="!!slots.end || undefined"
      :data-slot-start="!!slots.start || undefined"
      :disabled="disabled"
      v-bind="$attrs"
      @focusin="handleFocus"
      @focusout="handleBlur"
    >
      <div aria-hidden="true" class="m-select__target" />
      <span v-if="slots.start" class="m-select__start">
        <slot name="start" />
      </span>
      <div class="m-select__field">
        <mirror-select-value
          class="m-select__standin"
          :placeholder="placeholder"
        />
        <label class="m-select__label" :for="controlId">{{ label }}</label>
      </div>
      <span v-if="slots.end" class="m-select__end">
        <slot name="end" />
      </span>
      <!--
        Under `options.native` the content renders one hidden, inert box and
        nothing else, so it can sit inside the trigger. That keeps the whole
        component on a single root element, which is what lets a `class` from
        the call site fall through the way v1's did.
      -->
      <mirror-select-content>
        <mirror-select-item
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </mirror-select-content>
    </mirror-select-trigger>
  </mirror-select-root>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, useId, useSlots, watch } from 'vue'
import {
  SelectContent as MirrorSelectContent,
  SelectItem as MirrorSelectItem,
  SelectRoot as MirrorSelectRoot,
  SelectTrigger as MirrorSelectTrigger,
  SelectValue as MirrorSelectValue,
  useMirrorSelect,
} from '@maas/mirror/vue/Select'
import { selectBase, selectSize } from '../styles/select'

import type { ComponentPublicInstance } from 'vue'
import type { SelectModelValue, SelectOptions } from '@maas/mirror/vue/Select'
import type { MSelectProps } from '../types/select'

// Everything from the call site lands on the trigger, which is the `.m-select`
// box. `Select.Root` renders no element of its own and drops `$attrs`, so a
// `class` would otherwise never reach the DOM.
defineOptions({ inheritAttrs: false })

const {
  modelValue = '',
  options = [],
  id = '',
  label = 'Label',
  placeholder = 'Select',
  size = 'md',
  simple = false,
  blur = false,
  iconStart = false,
  iconEnd = false,
  disabled = false,
  error = false,
  required = false,
} = defineProps<MSelectProps>()

// v1 declared `submit` on a `<select>`, which never fires one. It is kept in
// the signature so an existing `@submit` still compiles, and it is never
// emitted here either.
const emit = defineEmits<{
  (e: 'update:modelValue' | 'submit', value: MSelectProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

const slots = useSlots()

const triggerRef = ref<ComponentPublicInstance | null>(null)

const classes = computed(() => [selectBase, selectSize[size]])

// Generated once during setup: `useId` reads the current instance, so calling
// it inside a computed returns a new id on every re-evaluation.
const generatedId = useId()

const mappedId = computed(() => id || generatedId)

/*
 * v1 put `id` on the `<select>` and used the same string as its `name`.
 * `Select.Trigger` owns the control now and generates the id itself, so the
 * prop reaches the control as the name and the `<label for>` follows the id
 * the part wrote. The `<select>` renders in the same commit as this component,
 * so one read on mount is enough.
 */
const controlId = ref('')

onMounted(() => {
  controlId.value = resolveSelect()?.id ?? ''
})

/*
 * v1 read an empty string as no selection: `filled` was `!!modelValue`, and
 * the float label stayed down. v2 reads anything but `null` as a value, so the
 * empty string travels as `null` on the way in and comes back out as `''`. The
 * rest of the component, `data-filled` included, then lines up with v1 without
 * the wrapper keeping a second copy of the state.
 */
const mappedValue = computed<SelectModelValue | null>(() =>
  modelValue === '' || modelValue === undefined ? null : modelValue
)

/*
 * The model travels one way in and one way out rather than through `v-model`.
 *
 * `Select.Root` decides once, at mount, whether it is controlled, by whether
 * `modelValue` is `undefined`. Its `modelValue` type has no `null`, so an
 * empty select cannot be bound controlled, and binding `undefined` would leave
 * it uncontrolled for good: a value arriving from outside, a form reset or a
 * record from the server, would never reach the store. So the prop seeds the
 * root as its `defaultValue` and every later change is written in through the
 * module's own composable, only when the two have actually drifted apart. The
 * way back out is the root's own event, which fires either way.
 */
const instanceId = useId()

const { value: currentValue, setValue } = useMirrorSelect(instanceId)

watch(mappedValue, (next) => {
  if (next !== currentValue.value) {
    setValue(next)
  }
})

function handleChange(value: SelectModelValue | null) {
  const next = (value ?? '') as MSelectProps['modelValue']

  // Writing the store publishes the value straight back out, so the guard
  // keeps a value the call site already holds from making a round trip.
  if (next !== modelValue) {
    emit('update:modelValue', next)
  }
}

const rootOptions = computed<SelectOptions>(() => ({
  native: true,
  name: mappedId.value,
  disabled,
  required,
}))

function resolveSelect(): HTMLSelectElement | null {
  const el = triggerRef.value?.$el as HTMLElement | undefined

  return el?.querySelector('select') ?? null
}

function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
}

function focus(e?: Event) {
  if (disabled) {
    return
  }

  e?.preventDefault()
  resolveSelect()?.focus()
}

defineExpose({
  focus,
})
</script>

<style>
/*
 * The port of v1’s `select.css`. Component tokens become the application
 * variables they resolved to, state classes become data attributes, and the
 * structural selectors carry over unchanged.
 *
 * Two of them change owner. `.-focused` and `.-filled` are now `data-focused`
 * and `data-filled`, both written by `Select.Trigger` from the `<select>` the
 * user actually focuses, so the wrapper keeps no copy of either.
 *
 * Unscoped, and every selector rooted at `.m-select`, because slot content and
 * the headless parts carry a different scope id than this component.
 */
.m-select {
  --m-select-padding: calc(var(--spacing) * 4);
  --m-select-padding-label: var(--spacing);
  --m-select-padding-slot: var(--spacing);
  --m-select-gap-label: var(--spacing);
  --m-select-font-size: var(--app-font-size-text-lg);
  --m-select-font-size-label: var(--app-font-size-text-2xs);
  --m-select-symbol: calc(var(--spacing) * 4.5);
  --m-select-blur: 0px;

  padding-inline: var(--m-select-padding);
  font-family: var(--app-font-family-text);
  outline-color: var(--app-color-primary-border-muted);
  outline-offset: calc(-1 * var(--app-dimension-border));
  outline-style: solid;
  outline-width: var(--app-dimension-border);
}

.m-select * {
  transition: all 100ms linear;
}

.m-select[data-size='xs'] {
  --m-select-padding: calc(var(--spacing) * 2);
  --m-select-gap-label: calc(var(--spacing) * 0.5);
  --m-select-font-size: var(--app-font-size-text-sm);
  --m-select-font-size-label: var(--app-font-size-text-3xs);
  --m-select-symbol: calc(var(--spacing) * 3.5);
}

.m-select[data-size='sm'] {
  --m-select-padding: calc(var(--spacing) * 3);
  --m-select-gap-label: calc(var(--spacing) * 0.75);
  --m-select-font-size: var(--app-font-size-text-md);
  --m-select-font-size-label: var(--app-font-size-text-2xs);
  --m-select-symbol: calc(var(--spacing) * 4);
}

.m-select[data-size='md'] {
  --m-select-padding: calc(var(--spacing) * 4);
  --m-select-gap-label: var(--spacing);
  --m-select-font-size: var(--app-font-size-text-lg);
  --m-select-font-size-label: var(--app-font-size-text-2xs);
  --m-select-symbol: calc(var(--spacing) * 4.5);
}

.m-select[data-size='lg'] {
  --m-select-padding: calc(var(--spacing) * 5);
  --m-select-gap-label: calc(var(--spacing) * 1.25);
  --m-select-font-size: var(--app-font-size-text-xl);
  --m-select-font-size-label: var(--app-font-size-text-2xs);
  --m-select-symbol: calc(var(--spacing) * 5);
}

/*
 * v1 painted the focus outline on the `<select>` itself, which v2 renders at
 * `opacity: 0`. The ring moves to an overlay of its own, the way `MInput`
 * draws it, and stays out of the way of the transparent control on top of it.
 */
.m-select .m-select__target {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  outline-color: transparent;
  outline-style: solid;
  pointer-events: none;
}

.m-select .m-select__field {
  position: relative;
  display: flex;
  max-height: 100%;
  width: 100%;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding-inline: var(--m-select-padding-label);
  pointer-events: none;
}

.m-select .m-select__start,
.m-select .m-select__end {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  cursor: pointer;
  font-size: var(--m-select-font-size-label);
  font-weight: var(--app-font-weight-text);
  white-space: nowrap;
}

.m-select .m-select__standin {
  display: flex;
  width: 100%;
  align-items: center;
  appearance: none;
  font-size: 0;
  font-weight: var(--app-font-weight-text);
  letter-spacing: var(--app-letter-spacing);
  line-height: normal;
  text-transform: var(--app-text-case);
}

.m-select:not([data-simple='true']) .m-select__standin {
  position: relative;
  height: 0;
  opacity: 0;
}

.m-select .m-select__label {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  font-size: var(--m-select-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
}

/* Focus lifts the label and paints the ring on the overlay, not the box. */
.m-select[data-focused='true'] {
  outline-color: var(--app-color-focus-border);
}

.m-select[data-focused='true'] .m-select__target {
  outline-color: var(--app-color-focus-outline);
  outline-width: var(--app-dimension-outline-focus);
}

.m-select[data-focused='true'] .m-select__field,
.m-select[data-filled='true'] .m-select__field {
  gap: var(--m-select-gap-label);
}

.m-select:not([data-simple='true'])[data-filled='true'] .m-select__field {
  height: auto;
}

.m-select:not([data-simple='true'])[data-filled='true'] .m-select__label,
.m-select:not([data-simple='true'])[data-focused='true'] .m-select__label {
  height: auto;
  font-size: var(--m-select-font-size-label);
  font-weight: var(--app-font-weight-text);
}

.m-select:not([data-simple='true'])[data-filled='true'] .m-select__standin,
.m-select:not([data-simple='true'])[data-focused='true'] .m-select__standin {
  height: var(--m-select-font-size);
  font-size: var(--m-select-font-size);
  opacity: 1;
}

.m-select:is(:has(svg), [data-icon-start='true'], [data-icon-end='true']) svg {
  width: var(--m-select-symbol);
}

.m-select[data-slot-start='true']:not(
    [data-icon-start='true'],
    [data-icon-end='true']
  ) {
  padding-left: var(--m-select-padding-slot);
}

.m-select[data-slot-end='true']:not(
    [data-icon-start='true'],
    [data-icon-end='true']
  ) {
  padding-right: var(--m-select-padding-slot);
}

/* Resting colour. The error and disabled blocks below override it. */
.m-select > .m-select__start,
.m-select > .m-select__end {
  color: var(--app-color-primary-fg-muted);
}

.m-select .m-select__standin {
  background: transparent;
  color: var(--app-color-primary-fg-solid);
}

.m-select .m-select__label {
  color: var(--app-color-primary-fg-muted);
}

.m-select[data-filled='true'] > .m-select__start,
.m-select[data-filled='true'] > .m-select__end {
  color: var(--app-color-primary-fg-solid);
}

/*
 * `simple` drops the floating label and shows the value in its place.
 *
 * v1 sized the simple label from `--select-font-size-label-simple-*`, a name
 * the token file never emitted, so every size but `md` fell back to inheriting
 * whatever the page set. It reads the input ramp here, which is the size the
 * label is replacing.
 */
.m-select[data-simple='true'] .m-select__field {
  height: 100%;
  transition: color 100ms linear;
}

.m-select[data-simple='true'] .m-select__standin {
  position: absolute;
  inset-block: 0;
  inset-inline: var(--m-select-padding-label);
  display: none;
  height: 100%;
  font-size: var(--m-select-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
  opacity: 1;
}

.m-select[data-simple='true'] .m-select__label {
  font-size: var(--m-select-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
  transition: color 100ms linear;
}

.m-select[data-simple='true'][data-focused='true'] .m-select__label,
.m-select[data-simple='true'][data-filled='true'] .m-select__label {
  display: none;
}

.m-select[data-simple='true'][data-focused='true'] .m-select__standin,
.m-select[data-simple='true'][data-filled='true'] .m-select__standin {
  display: flex;
}

/* v1’s `dimension.blur.default` is `0px`, unlike Input’s `1rem`. */
.m-select[data-blur='true'] {
  backdrop-filter: blur(var(--m-select-blur));
}

.m-select[data-error='true']:not([data-focused='true']) {
  background: var(--app-color-danger-bg-subtle);
  outline-color: var(--app-color-danger-border-muted);
}

.m-select[data-error='true']:not([data-focused='true']) > .m-select__start,
.m-select[data-error='true']:not([data-focused='true']) > .m-select__end {
  color: var(--app-color-danger-fg-muted);
  pointer-events: none;
}

.m-select[data-error='true']:not([data-focused='true']) .m-select__standin {
  background: transparent;
  color: var(--app-color-danger-fg-on-subtle);
}

.m-select[data-error='true']:not([data-focused='true']) .m-select__label {
  color: var(--app-color-danger-fg-muted);
}

.m-select[data-error='true'][data-filled='true']:not([data-focused='true'])
  > .m-select__start,
.m-select[data-error='true'][data-filled='true']:not([data-focused='true'])
  > .m-select__end {
  color: var(--app-color-danger-fg-on-subtle);
}

.m-select[data-disabled='true'] {
  background: transparent;
  cursor: not-allowed;
  outline-color: var(--app-color-disabled-border-subtle);
}

.m-select[data-disabled='true'] .m-select__field,
.m-select[data-disabled='true'] > .m-select__start,
.m-select[data-disabled='true'] > .m-select__end {
  pointer-events: none;
}

.m-select[data-disabled='true'] > .m-select__start,
.m-select[data-disabled='true'] > .m-select__end {
  color: var(--app-color-disabled-fg-muted);
}

.m-select[data-disabled='true'] .m-select__standin {
  background: transparent;
  color: var(--app-color-disabled-fg-solid);
}

.m-select[data-disabled='true'] .m-select__label {
  color: var(--app-color-disabled-fg-muted);
  cursor: not-allowed;
}

.m-select[data-disabled='true'][data-filled='true'] > .m-select__start,
.m-select[data-disabled='true'][data-filled='true'] > .m-select__end {
  color: var(--app-color-disabled-fg-solid);
}
</style>
