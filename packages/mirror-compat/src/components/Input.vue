<template>
  <div
    ref="elRef"
    :aria-disabled="disabled"
    :aria-invalid="error"
    :aria-required="required"
    :aria-valuenow="mappedValue"
    :class="classes"
    :data-blur="blur || undefined"
    :data-disabled="disabled || undefined"
    :data-error="error || undefined"
    :data-filled="filled || undefined"
    :data-focused="focused || undefined"
    :data-icon-end="iconEnd || undefined"
    :data-icon-start="iconStart || undefined"
    :data-simple="simple || undefined"
    :data-size="size"
    :data-slot-end="!!slots.end || undefined"
    :data-slot-start="!!slots.start || undefined"
  >
    <div class="m-input__target" @click.self="focus" />
    <span v-if="slots.start" class="m-input__start">
      <slot name="start" />
    </span>
    <div class="m-input__field">
      <span class="m-input__control">
        <MirrorInput
          :id="mappedId"
          v-model="mappedValue"
          :disabled="disabled"
          :name="mappedId"
          :placeholder="label"
          :required="required"
          :spellcheck="spellcheck"
          :type="type"
          @blur="handleBlur"
          @focus="handleFocus"
        />
      </span>
      <label class="m-input__label" :for="mappedId">{{ label }}</label>
    </div>
    <span v-if="slots.end" class="m-input__end">
      <slot name="end" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useId, useSlots } from 'vue'
import { Input as MirrorInput } from '@maas/mirror/vue/Input'
import { inputBase, inputSize } from '../styles/input'

import type { MInputProps } from '../types/input'

const {
  modelValue = '',
  id = '',
  label = 'Label',
  size = 'md',
  type = 'text',
  simple = false,
  blur = false,
  iconStart = false,
  iconEnd = false,
  disabled = false,
  spellcheck = false,
  error = false,
  required = false,
} = defineProps<MInputProps>()

const emit = defineEmits<{
  (e: 'update:modelValue' | 'submit', value: MInputProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

const slots = useSlots()

const elRef = ref<HTMLDivElement | undefined>(undefined)

const classes = computed(() => [inputBase, inputSize[size]])

const mappedValue = computed({
  get() {
    return modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// Generated once during setup: `useId` reads the current instance, so calling
// it inside a computed returns a new id on every re-evaluation.
const generatedId = useId()

const mappedId = computed(() => id || generatedId)

const filled = computed(() => !!mappedValue.value)

// The headless part tracks focus on the control and writes `data-focused`
// there. The wrapper needs the same state one level up, where the float-label
// and ring rules live, so it keeps its own copy from the same two events.
const focused = ref(false)

function resolveInput(): HTMLInputElement | null {
  return elRef.value?.querySelector('input') ?? null
}

function handleFocus() {
  focused.value = true
  emit('focus')
}

function handleBlur() {
  focused.value = false
  emit('blur')
}

function toLast() {
  const input = resolveInput()
  input?.setSelectionRange(input.value.length, input.value.length)
}

function focus(e?: Event) {
  if (disabled) {
    return
  }

  e?.preventDefault()
  resolveInput()?.focus()
  toLast()
}

defineExpose({
  focus,
})
</script>

<style>
/*
 * The port of v1’s `input.css`. Component tokens become the application
 * variables they resolved to, state classes become the data attributes the
 * wrapper writes, and the structural selectors carry over unchanged.
 *
 * Unscoped, and every selector rooted at `.m-input`, because slot content and
 * the headless control carry a different scope id than this component.
 */
.m-input {
  --m-input-padding: calc(var(--spacing) * 4);
  --m-input-padding-label: var(--spacing);
  --m-input-padding-slot: var(--spacing);
  --m-input-gap-label: var(--spacing);
  --m-input-font-size: var(--app-font-size-text-lg);
  --m-input-font-size-label: var(--app-font-size-text-2xs);
  --m-input-symbol: calc(var(--spacing) * 4.5);
  --m-input-blur: 1rem;

  padding-inline: var(--m-input-padding);
  font-family: var(--app-font-family-text);
  outline-color: var(--app-color-primary-border-muted);
  outline-offset: calc(-1 * var(--app-dimension-border));
  outline-style: solid;
  outline-width: var(--app-dimension-border);
}

.m-input * {
  transition: all 100ms linear;
}

.m-input[data-size='xs'] {
  --m-input-padding: calc(var(--spacing) * 2);
  --m-input-gap-label: calc(var(--spacing) * 0.5);
  --m-input-font-size: var(--app-font-size-text-sm);
  --m-input-font-size-label: var(--app-font-size-text-3xs);
  --m-input-symbol: calc(var(--spacing) * 3.5);
}

.m-input[data-size='sm'] {
  --m-input-padding: calc(var(--spacing) * 3);
  --m-input-gap-label: calc(var(--spacing) * 0.75);
  --m-input-font-size: var(--app-font-size-text-md);
  --m-input-font-size-label: var(--app-font-size-text-2xs);
  --m-input-symbol: calc(var(--spacing) * 4);
}

.m-input[data-size='md'] {
  --m-input-padding: calc(var(--spacing) * 4);
  --m-input-gap-label: var(--spacing);
  --m-input-font-size: var(--app-font-size-text-lg);
  --m-input-font-size-label: var(--app-font-size-text-2xs);
  --m-input-symbol: calc(var(--spacing) * 4.5);
}

.m-input[data-size='lg'] {
  --m-input-padding: calc(var(--spacing) * 5);
  --m-input-gap-label: calc(var(--spacing) * 1.25);
  --m-input-font-size: var(--app-font-size-text-xl);
  --m-input-font-size-label: var(--app-font-size-text-2xs);
  --m-input-symbol: calc(var(--spacing) * 5);
}

.m-input .m-input__target {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  outline-color: transparent;
  outline-style: solid;
}

.m-input .m-input__field {
  position: relative;
  display: flex;
  height: 100%;
  max-height: 100%;
  width: 100%;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding-inline: var(--m-input-padding-label);
}

.m-input:not([data-simple='true']) .m-input__control {
  position: relative;
  display: flex;
  height: 0;
  width: 100%;
  align-items: flex-end;
}

/* Focus lifts the label and paints the ring on the overlay, not the box. */
.m-input:has(.m-input__field:focus-within),
.m-input[data-focused='true'] {
  outline-color: var(--app-color-focus-border);
}

.m-input:has(.m-input__field:focus-within) .m-input__field,
.m-input[data-focused='true'] .m-input__field {
  gap: var(--m-input-gap-label);
}

.m-input:has(.m-input__field:focus-within) .m-input__target,
.m-input[data-focused='true'] .m-input__target {
  outline-color: var(--app-color-focus-outline);
  outline-width: var(--app-dimension-outline-focus);
}

.m-input:has(input:not(:placeholder-shown)) .m-input__field,
.m-input[data-filled='true'] .m-input__field {
  gap: var(--m-input-gap-label);
}

.m-input:not([data-simple='true'])[data-filled='true'] .m-input__label,
.m-input:not([data-simple='true'])
  .m-input__control:has(input:not(:placeholder-shown))
  + .m-input__label,
.m-input:not([data-simple='true'])
  .m-input__field:focus-within
  > .m-input__label {
  height: auto;
  cursor: auto;
  font-size: var(--m-input-font-size-label);
  font-weight: var(--app-font-weight-text);
}

.m-input:not([data-simple='true'])
  .m-input__control:has(input:not(:placeholder-shown)),
.m-input:not([data-simple='true'])[data-filled='true'] .m-input__control,
.m-input:not([data-simple='true'])
  .m-input__field:focus-within
  > .m-input__control {
  height: var(--m-input-font-size);
}

.m-input .m-input__control input {
  display: block;
  height: 0;
  width: 100%;
  appearance: none;
  background: transparent;
  font-size: var(--m-input-font-size);
  font-weight: var(--app-font-weight-text);
  letter-spacing: var(--app-letter-spacing);
  line-height: normal;
  text-transform: var(--app-text-case);
}

.m-input .m-input__control input::placeholder {
  color: transparent;
}

.m-input .m-input__control input:autofill {
  background-clip: text !important;
  -webkit-text-fill-color: var(--app-color-primary-fg-solid);
  caret-color: var(--app-color-primary-fg-solid);
}

.m-input .m-input__control input:not(:placeholder-shown),
.m-input .m-input__control input:focus {
  height: 1lh;
  outline: none;
}

.m-input .m-input__control input:focus-visible {
  box-shadow: none;
}

.m-input .m-input__control input[type='number'] {
  -moz-appearance: textfield;
}

.m-input .m-input__control input[type='number']::-webkit-inner-spin-button,
.m-input .m-input__control input[type='number']::-webkit-outer-spin-button {
  margin: 0;
  -webkit-appearance: none;
}

.m-input .m-input__label {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  cursor: text;
  font-size: var(--m-input-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
}

.m-input .m-input__start,
.m-input .m-input__end {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  cursor: default;
  white-space: nowrap;
}

.m-input:is(:has(svg), [data-icon-start='true'], [data-icon-end='true']) svg {
  width: var(--m-input-symbol);
}

.m-input[data-slot-start='true']:not(
    [data-icon-start='true'],
    [data-icon-end='true']
  ) {
  padding-left: calc(var(--m-input-padding-slot) + var(--app-dimension-border));
}

.m-input[data-slot-end='true']:not(
    [data-icon-start='true'],
    [data-icon-end='true']
  ) {
  padding-right: calc(
    var(--m-input-padding-slot) + var(--app-dimension-border)
  );
}

/* Resting colour. The error and disabled blocks below override it. */
.m-input > .m-input__start,
.m-input > .m-input__end {
  color: var(--app-color-primary-fg-muted);
}

.m-input .m-input__control {
  background: transparent;
  color: var(--app-color-primary-fg-solid);
}

.m-input .m-input__label {
  color: var(--app-color-primary-fg-muted);
}

.m-input:has(input:not(:placeholder-shown)) > .m-input__start,
.m-input:has(input:not(:placeholder-shown)) > .m-input__end,
.m-input[data-filled='true'] > .m-input__start,
.m-input[data-filled='true'] > .m-input__end {
  color: var(--app-color-primary-fg-solid);
}

/* `simple` drops the floating label for a plain placeholder. */
.m-input[data-simple='true'] .m-input__field {
  height: 100%;
  transition: color 100ms linear;
}

.m-input[data-simple='true'] .m-input__control {
  position: absolute;
  inset: 0;
}

.m-input[data-simple='true'] .m-input__control input {
  position: absolute;
  inset-block: 0;
  inset-inline: var(--m-input-padding-label);
  height: 100%;
  font-size: var(--m-input-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
  transition: color 100ms linear;
}

.m-input[data-simple='true'] .m-input__label {
  font-size: var(--m-input-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
  transform: unset;
}

.m-input[data-simple='true'] .m-input__field:focus-within > .m-input__label,
.m-input[data-simple='true'][data-filled='true'] .m-input__label,
.m-input[data-simple='true']
  .m-input__control:has(input:not(:placeholder-shown))
  + .m-input__label {
  display: none;
}

.m-input[data-blur='true'] {
  backdrop-filter: blur(var(--m-input-blur));
}

.m-input[data-error='true']:not(:has(.m-input__field:focus-within)):not(
    [data-focused='true']
  ) {
  background: var(--app-color-danger-bg-subtle);
  outline-color: var(--app-color-danger-border-muted);
}

.m-input[data-error='true']:not(:has(.m-input__field:focus-within)):not(
    [data-focused='true']
  )
  > .m-input__start,
.m-input[data-error='true']:not(:has(.m-input__field:focus-within)):not(
    [data-focused='true']
  )
  > .m-input__end {
  color: var(--app-color-danger-fg-muted);
  pointer-events: none;
}

.m-input[data-error='true']:not(:has(.m-input__field:focus-within)):not(
    [data-focused='true']
  )
  .m-input__control {
  background: transparent;
  color: var(--app-color-danger-fg-on-subtle);
}

.m-input[data-error='true']:not(:has(.m-input__field:focus-within)):not(
    [data-focused='true']
  )
  .m-input__label {
  color: var(--app-color-danger-fg-muted);
}

.m-input[data-error='true'][data-filled='true']:not(
    :has(.m-input__field:focus-within)
  ):not([data-focused='true'])
  > .m-input__start,
.m-input[data-error='true'][data-filled='true']:not(
    :has(.m-input__field:focus-within)
  ):not([data-focused='true'])
  > .m-input__end {
  color: var(--app-color-danger-fg-on-subtle);
}

.m-input:has(input:disabled),
.m-input[data-disabled='true'] {
  background: transparent;
  cursor: not-allowed;
  outline-color: var(--app-color-disabled-border-subtle);
}

.m-input:has(input:disabled) .m-input__field,
.m-input:has(input:disabled) > .m-input__start,
.m-input:has(input:disabled) > .m-input__end,
.m-input[data-disabled='true'] .m-input__field,
.m-input[data-disabled='true'] > .m-input__start,
.m-input[data-disabled='true'] > .m-input__end {
  pointer-events: none;
}

.m-input:has(input:disabled) .m-input__label,
.m-input[data-disabled='true'] .m-input__label {
  color: var(--app-color-disabled-fg-muted);
  cursor: not-allowed;
}

.m-input:has(input:disabled) > .m-input__start,
.m-input:has(input:disabled) > .m-input__end,
.m-input[data-disabled='true'] > .m-input__start,
.m-input[data-disabled='true'] > .m-input__end {
  color: var(--app-color-disabled-fg-muted);
}

.m-input:has(input:disabled) .m-input__control,
.m-input[data-disabled='true'] .m-input__control {
  background: transparent;
  color: var(--app-color-disabled-fg-solid);
}

.m-input[data-disabled='true'][data-filled='true'] > .m-input__start,
.m-input[data-disabled='true'][data-filled='true'] > .m-input__end {
  color: var(--app-color-disabled-fg-solid);
}
</style>
