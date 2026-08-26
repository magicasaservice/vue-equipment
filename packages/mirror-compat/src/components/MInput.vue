<template>
  <field-root
    as="div"
    :class="[
      'm-input',
      {
        '-disabled': disabled,
        '-focused': focused,
        '-filled': filled,
        '-simple': simple,
        '-blur': blur,
        '-error': error,
        '-icon-start': iconStart,
        '-icon-end': iconEnd,
        '-slot-start': !!$slots.start,
        '-slot-end': !!$slots.end,
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
    <div class="m-input__target" @click.self="focus" />
    <span v-if="$slots.start">
      <slot name="start" />
    </span>
    <div>
      <span>
        <input-control
          :id="mappedId"
          ref="inputRef"
          :disabled="disabled"
          :model-value="modelValue"
          :name="mappedId"
          :placeholder="label"
          :required="required"
          :spellcheck="spellcheck"
          :type="type"
          @blur="onBlur"
          @focus="onFocus"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </span>
      <label-root :for="mappedId">{{ label }}</label-root>
    </div>
    <span v-if="$slots.end">
      <slot name="end" />
    </span>
  </field-root>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-required-prop-with-default -- v1's shape, verbatim */
import { computed, ref, useId, useTemplateRef } from 'vue'
import {
  FieldRoot,
  Input as InputControl,
  Label as LabelRoot,
} from '@maas/mirror/vue'

// `IInputProps`, verbatim
interface MInputProps {
  modelValue: string | number
  id?: string
  label: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  simple?: boolean
  blur?: boolean
  iconStart?: boolean
  iconEnd?: boolean
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

const inputRef = useTemplateRef<{ $el: HTMLInputElement }>('inputRef')

// Private state
const generatedId = useId()
const focused = ref(false)

// Public state
const mappedId = computed(() => (id ? id : generatedId))

const filled = computed(() => !!modelValue)

// Private functions
function toLast() {
  const input = inputRef.value?.$el
  input?.setSelectionRange(input.value.length, input.value.length)
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
    inputRef.value?.$el?.focus()
    toLast()
  }
}

defineExpose({
  focus,
})
</script>
