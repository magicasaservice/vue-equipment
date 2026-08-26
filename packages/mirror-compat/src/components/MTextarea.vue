<template>
  <field-root
    as="div"
    :class="[
      'm-textarea',
      {
        '-disabled': disabled,
        '-focused': focused,
        '-filled': filled,
        '-simple': simple,
        '-blur': blur,
        '-error': error,
      },
      `-${size}`,
    ]"
    :aria-disabled="disabled"
    :aria-invalid="error"
    :aria-required="required"
    :aria-valuenow="modelValue"
    :disabled="disabled"
    :invalid="error || undefined"
    :required="required"
  >
    <div class="m-textarea__outer">
      <div class="m-textarea__target" @click.self="focus" />
      <div class="m-textarea__inner">
        <span>
          <!--
            v1 wrote the mirrored value through `v-html`. Interpolation renders
            identically under `white-space: pre-wrap` and does not evaluate
            markup, so the sizing box stays the same and the injection goes away.
          -->
          <div class="m-textarea__mirror" :aria-hidden="true">
            {{ mirroredValue }}
          </div>
          <textarea-control
            :id="mappedId"
            ref="textareaRef"
            :disabled="disabled"
            :model-value="modelValue"
            :name="mappedId"
            :placeholder="label"
            :required="required"
            :spellcheck="spellcheck"
            @blur="onBlur"
            @focus="onFocus"
            @update:model-value="emit('update:modelValue', $event)"
          />
        </span>
        <label-root :for="mappedId">{{ label }}</label-root>
      </div>
    </div>
  </field-root>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-required-prop-with-default -- v1's shape, verbatim */
import { computed, ref, useId, useTemplateRef } from 'vue'
import {
  FieldRoot,
  Label as LabelRoot,
  Textarea as TextareaControl,
} from '@maas/mirror/vue'

// `ITextareaProps`, verbatim
interface MTextareaProps {
  modelValue: string | number
  id?: string
  label: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  simple?: boolean
  blur?: boolean
  disabled?: boolean
  spellcheck?: boolean
  error?: boolean
  required?: boolean
}

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

const textareaRef = useTemplateRef<{ $el: HTMLTextAreaElement }>('textareaRef')

// Private state
const generatedId = useId()
const focused = ref(false)

// Public state
const mappedId = computed(() => (id ? id : generatedId))

const filled = computed(() => !!modelValue)

// Zero-width space at the end to preserve line breaks
const mirroredValue = computed(() => `${modelValue}\u200b`)

// Private functions
function toLast() {
  const textarea = textareaRef.value?.$el
  textarea?.setSelectionRange(textarea.value.length, textarea.value.length)
}

function onFocus() {
  focused.value = true
  emit('focus')
}

function onBlur() {
  focused.value = false
  emit('blur')
}

// Public functions
function focus(e?: Event) {
  if (!disabled) {
    e?.preventDefault()
    textareaRef.value?.$el?.focus()
    toLast()
  }
}

defineExpose({
  focus,
})
</script>
