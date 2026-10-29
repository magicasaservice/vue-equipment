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
    :data-simple="simple || undefined"
    :data-size="size"
  >
    <div class="m-textarea__outer">
      <div class="m-textarea__target" @click.self="focus" />
      <div class="m-textarea__inner">
        <span class="m-textarea__line">
          <div aria-hidden="true" class="m-textarea__mirror">
            {{ mirroredValue }}
          </div>
          <MirrorTextarea
            :id="mappedId"
            v-model="mappedValue"
            :disabled="disabled"
            :name="mappedId"
            :placeholder="label"
            :required="required"
            :spellcheck="spellcheck"
            @blur="handleBlur"
            @focus="handleFocus"
          />
        </span>
        <label class="m-textarea__label" :for="mappedId">{{ label }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useId } from 'vue'
import { Textarea as MirrorTextarea } from '@maas/mirror/vue/Textarea'
import { textareaBase, textareaRadius } from '../styles/textarea'

import type { MTextareaProps } from '../types/textarea'

const {
  modelValue = '',
  id = '',
  label = 'Label',
  size = 'md',
  simple = false,
  blur = false,
  disabled = false,
  spellcheck = false,
  error = false,
  required = false,
} = defineProps<MTextareaProps>()

const emit = defineEmits<{
  (e: 'update:modelValue' | 'submit', value: MTextareaProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

const elRef = ref<HTMLDivElement | undefined>(undefined)

const classes = computed(() => [textareaBase, textareaRadius[size]])

const mappedValue = computed({
  get() {
    return modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// The mirror sits in the same grid cell as the control and is what makes the
// box grow: the row is as tall as the taller of the two, and the mirror wraps
// the value the way the control does. It is rendered as text rather than as
// markup, so a value that happens to contain a tag still measures as the
// characters the reader typed. The zero-width space keeps a trailing newline.
const mirroredValue = computed(() => `${mappedValue.value}\u200b`)

// Generated once during setup: `useId` reads the current instance, so calling
// it inside a computed returns a new id on every re-evaluation.
const generatedId = useId()

const mappedId = computed(() => id || generatedId)

const filled = computed(() => !!mappedValue.value)

// The headless part tracks focus on the control and writes `data-focused`
// there. The wrapper needs the same state one level up, where the float-label
// and ring rules live, so it keeps its own copy from the same two events.
const focused = ref(false)

function resolveTextarea(): HTMLTextAreaElement | null {
  return elRef.value?.querySelector('textarea') ?? null
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
  const textarea = resolveTextarea()
  textarea?.setSelectionRange(textarea.value.length, textarea.value.length)
}

function focus(e?: Event) {
  if (disabled) {
    return
  }

  e?.preventDefault()
  resolveTextarea()?.focus()
  toLast()
}

defineExpose({
  focus,
})
</script>

<style>
/*
 * The port of v1’s `textarea.css`. Component tokens become the application
 * variables they resolved to, state classes become the data attributes the
 * wrapper writes, and the structural selectors carry over unchanged.
 *
 * Unscoped, and every selector rooted at `.m-textarea`, because the headless
 * control carries a different scope id than this component.
 *
 * Four rules from v1 are not reproduced. Its `[type='number']` blocks address
 * an attribute a textarea has no meaning for. Its `.m-textarea > span` and
 * `> .m-textarea__inner` selectors ask for a direct child that the markup has
 * never had, and its `.m-textarea__placeholder` selectors name a class that
 * has never been rendered, so none of the three could ever match. The
 * scrollbar is hidden on the element that scrolls rather than on the root,
 * which is the element v1 aimed at and missed.
 */
.m-textarea {
  --m-textarea-padding: calc(var(--spacing) * 4);
  --m-textarea-padding-filled: calc(var(--spacing) * 2);
  --m-textarea-padding-label: 4px;
  --m-textarea-gap-label: var(--spacing);
  --m-textarea-min-height: calc(var(--spacing) * 24);
  --m-textarea-max-height: calc(var(--spacing) * 48);
  --m-textarea-font-size: var(--app-font-size-text-lg);
  --m-textarea-font-size-label: var(--app-font-size-text-2xs);
  --m-textarea-blur: 1rem;

  /* The control grows with the mirror behind it, so it never resizes itself. */
  --mirror-textarea-resize: none;

  font-family: var(--app-font-family-text);
  outline-color: var(--app-color-primary-border-muted);
  outline-offset: calc(-1 * var(--app-dimension-border));
  outline-style: solid;
  outline-width: var(--app-dimension-border);
}

.m-textarea * {
  transition: all 100ms linear;
}

.m-textarea[data-size='xs'] {
  --m-textarea-padding: calc(var(--spacing) * 2);
  --m-textarea-padding-filled: var(--spacing);
  --m-textarea-gap-label: calc(var(--spacing) * 0.5);
  --m-textarea-min-height: calc(var(--spacing) * 16);
  --m-textarea-max-height: calc(var(--spacing) * 30);
  --m-textarea-font-size: var(--app-font-size-text-sm);
  --m-textarea-font-size-label: var(--app-font-size-text-3xs);
}

.m-textarea[data-size='sm'] {
  --m-textarea-padding: calc(var(--spacing) * 3);
  --m-textarea-padding-filled: calc(var(--spacing) * 1.5);
  --m-textarea-gap-label: calc(var(--spacing) * 0.75);
  --m-textarea-min-height: calc(var(--spacing) * 20);
  --m-textarea-max-height: calc(var(--spacing) * 36);
  --m-textarea-font-size: var(--app-font-size-text-md);
  --m-textarea-font-size-label: var(--app-font-size-text-2xs);
}

.m-textarea[data-size='md'] {
  --m-textarea-padding: calc(var(--spacing) * 4);
  --m-textarea-padding-filled: calc(var(--spacing) * 2);
  --m-textarea-gap-label: var(--spacing);
  --m-textarea-min-height: calc(var(--spacing) * 24);
  --m-textarea-max-height: calc(var(--spacing) * 48);
  --m-textarea-font-size: var(--app-font-size-text-lg);
  --m-textarea-font-size-label: var(--app-font-size-text-2xs);
}

.m-textarea[data-size='lg'] {
  --m-textarea-padding: calc(var(--spacing) * 5);
  --m-textarea-padding-filled: calc(var(--spacing) * 2.5);
  --m-textarea-gap-label: calc(var(--spacing) * 1.25);
  --m-textarea-min-height: calc(var(--spacing) * 28);
  --m-textarea-max-height: calc(var(--spacing) * 60);
  --m-textarea-font-size: var(--app-font-size-text-xl);
  --m-textarea-font-size-label: var(--app-font-size-text-2xs);
}

/* The ring is painted on an overlay so the box never moves when it appears. */
.m-textarea::before {
  position: absolute;
  content: '';
  inset: 0;
  border-radius: inherit;
  outline-color: transparent;
  outline-style: solid;
}

.m-textarea .m-textarea__outer {
  inline-size: 100%;
  min-block-size: var(--m-textarea-min-height);
  max-block-size: var(--m-textarea-max-height);
  border-radius: inherit;
  padding: var(--m-textarea-padding);
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.m-textarea .m-textarea__outer::-webkit-scrollbar {
  display: none;
}

.m-textarea .m-textarea__target {
  position: absolute;
  z-index: 10;
  inset: 0;
  border-radius: inherit;
}

.m-textarea .m-textarea__inner {
  position: relative;
  display: flex;
  inline-size: 100%;
  max-block-size: 100%;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding-inline: var(--m-textarea-padding-label);
  pointer-events: none;
}

.m-textarea .m-textarea__line {
  position: relative;
  display: grid;
  inline-size: 100%;
  min-block-size: 0;
  overflow-x: clip;
  pointer-events: none;
}

.m-textarea .m-textarea__mirror {
  display: flex;
  grid-area: 1 / 1;
  inline-size: 100%;
  font-family: inherit;
  font-size: var(--m-textarea-font-size);
  font-weight: var(--app-font-weight-text);
  letter-spacing: var(--app-letter-spacing);
  line-height: var(--app-line-height);
  opacity: 0;
  overflow-wrap: break-word;
  pointer-events: none;
  text-transform: var(--app-text-case);
  user-select: none;
  white-space: pre-wrap;
}

.m-textarea .m-textarea__line textarea {
  z-index: 20;
  grid-area: 1 / 1;
  inline-size: 100%;
  appearance: none;
  background: transparent;
  color: var(--app-color-primary-fg-solid);
  font-family: inherit;
  font-size: var(--m-textarea-font-size);
  font-weight: var(--app-font-weight-text);
  letter-spacing: var(--app-letter-spacing);
  line-height: var(--app-line-height);
  overflow: hidden;
  pointer-events: auto;
  text-transform: var(--app-text-case);
}

.m-textarea .m-textarea__line textarea::placeholder {
  color: transparent;
}

.m-textarea .m-textarea__line textarea:autofill {
  background-clip: text !important;
  -webkit-text-fill-color: var(--app-color-primary-fg-solid);
  caret-color: var(--app-color-primary-fg-solid);
}

.m-textarea .m-textarea__line textarea:not(:placeholder-shown),
.m-textarea .m-textarea__line textarea:focus {
  outline: none;
}

.m-textarea .m-textarea__line textarea:focus-visible {
  box-shadow: none;
}

.m-textarea .m-textarea__label {
  display: flex;
  block-size: 100%;
  inline-size: 100%;
  align-items: center;
  color: var(--app-color-primary-fg-muted);
  cursor: text;
  font-size: var(--m-textarea-font-size);
  font-weight: var(--app-font-weight-text);
  line-height: normal;
}

/* Focus lifts the label and paints the ring on the overlay, not the box. */
.m-textarea:has(.m-textarea__inner:focus-within),
.m-textarea[data-focused='true'] {
  outline-color: var(--app-color-focus-border);
}

.m-textarea:has(.m-textarea__inner:focus-within)::before,
.m-textarea[data-focused='true']::before {
  outline-color: var(--app-color-focus-outline);
  outline-width: var(--app-dimension-outline-focus);
}

.m-textarea:not([data-simple='true']):has(.m-textarea__inner:focus-within)
  .m-textarea__outer,
.m-textarea:not([data-simple='true'])[data-focused='true'] .m-textarea__outer,
.m-textarea:not([data-simple='true']):has(textarea:not(:placeholder-shown))
  .m-textarea__outer,
.m-textarea:not([data-simple='true'])[data-filled='true'] .m-textarea__outer {
  padding-block: var(--m-textarea-padding-filled);
}

.m-textarea:not([data-simple='true']):has(.m-textarea__inner:focus-within)
  .m-textarea__inner,
.m-textarea:not([data-simple='true'])[data-focused='true'] .m-textarea__inner,
.m-textarea:not([data-simple='true']):has(textarea:not(:placeholder-shown))
  .m-textarea__inner,
.m-textarea:not([data-simple='true'])[data-filled='true'] .m-textarea__inner {
  gap: var(--m-textarea-gap-label);
}

.m-textarea:not([data-simple='true'])[data-filled='true'] .m-textarea__label,
.m-textarea:not([data-simple='true'])
  .m-textarea__line:has(textarea:not(:placeholder-shown))
  + .m-textarea__label,
.m-textarea:not([data-simple='true'])
  .m-textarea__inner:focus-within
  > .m-textarea__label {
  block-size: auto;
  cursor: auto;
  font-size: var(--m-textarea-font-size-label);
  font-weight: var(--app-font-weight-text);
}

.m-textarea:not([data-simple='true'])
  .m-textarea__line:has(textarea:not(:placeholder-shown)),
.m-textarea:not([data-simple='true'])[data-filled='true'] .m-textarea__line,
.m-textarea:not([data-simple='true'])
  .m-textarea__inner:focus-within
  > .m-textarea__line {
  min-block-size: 1lh;
}

/* `simple` drops the floating label for a plain placeholder. */
.m-textarea[data-simple='true']:has(textarea:not(:placeholder-shown))
  .m-textarea__mirror,
.m-textarea[data-simple='true'][data-filled='true'] .m-textarea__mirror,
.m-textarea[data-simple='true']:has(.m-textarea__inner:focus-within)
  .m-textarea__mirror,
.m-textarea[data-simple='true'][data-focused='true'] .m-textarea__mirror {
  min-block-size: 1lh;
}

.m-textarea[data-simple='true'] .m-textarea__inner {
  block-size: 100%;
  transition: color 100ms linear;
}

.m-textarea[data-simple='true'] .m-textarea__line textarea {
  transition: color 100ms linear;
}

.m-textarea[data-simple='true'][data-filled='true'] .m-textarea__label,
.m-textarea[data-simple='true']
  .m-textarea__line:has(textarea:not(:placeholder-shown))
  + .m-textarea__label,
.m-textarea[data-simple='true']
  .m-textarea__inner:focus-within
  > .m-textarea__label {
  display: none;
}

.m-textarea[data-blur='true'] {
  backdrop-filter: blur(var(--m-textarea-blur));
}

.m-textarea[data-error='true']:not(:has(.m-textarea__inner:focus-within)):not(
    [data-focused='true']
  ) {
  background: var(--app-color-danger-bg-subtle);
  outline-color: var(--app-color-danger-border-muted);
}

.m-textarea[data-error='true'] .m-textarea__line textarea {
  color: var(--app-color-danger-fg-on-subtle);
}

.m-textarea[data-error='true'] .m-textarea__label {
  color: var(--app-color-danger-fg-subtle);
}

.m-textarea:has(textarea:disabled),
.m-textarea[data-disabled='true'] {
  background: transparent;
  cursor: not-allowed;
  outline-color: var(--app-color-disabled-border-subtle);
}

.m-textarea:has(textarea:disabled) .m-textarea__inner,
.m-textarea[data-disabled='true'] .m-textarea__inner {
  pointer-events: none;
}

.m-textarea:has(textarea:disabled) .m-textarea__line textarea,
.m-textarea[data-disabled='true'] .m-textarea__line textarea {
  color: var(--app-color-disabled-fg-solid);
  pointer-events: none;
}

.m-textarea:has(textarea:disabled) .m-textarea__label,
.m-textarea[data-disabled='true'] .m-textarea__label {
  color: var(--app-color-disabled-fg-muted);
  cursor: not-allowed;
  pointer-events: none;
}
</style>
