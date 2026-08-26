<template>
  <div
    :class="[
      'm-select',
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
  >
    <!--
      Compat keeps the native `<select>`. Mirror ships a headless `Select`, but
      swapping a portalled listbox in here would trade the system picker, the
      platform's typeahead and native form submission for a styled popup. Call
      sites migrate to `Select.*` on their own schedule.
    -->
    <select
      :id="mappedId"
      ref="selectRef"
      v-model="mappedValue"
      :disabled="disabled"
      :name="mappedId"
      :placeholder="label"
      :required="required"
      @blur="onBlur"
      @focus="onFocus"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span v-if="$slots.start">
      <slot name="start" />
    </span>
    <div>
      <span class="m-select__standin" :aria-hidden="true">
        {{ mappedStandin }}
      </span>
      <label :for="mappedId">{{ label }}</label>
    </div>
    <span v-if="$slots.end">
      <slot name="end" />
    </span>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-required-prop-with-default -- v1's shape, verbatim */
import { computed, ref, useId, useTemplateRef } from 'vue'

// `ISelectProps`, verbatim
interface MSelectProps {
  modelValue: string | number
  options: {
    value: string | number
    label: string
  }[]
  id?: string
  label: string
  placeholder: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  simple?: boolean
  blur?: boolean
  iconStart?: boolean
  iconEnd?: boolean
  disabled?: boolean
  error?: boolean
  required?: boolean
}

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

const emit = defineEmits<{
  (e: 'update:modelValue' | 'submit', value: MSelectProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

const selectRef = useTemplateRef<HTMLSelectElement>('selectRef')

// Private state
const generatedId = useId()
const focused = ref(false)

// Public state
const mappedId = computed(() => (id ? id : generatedId))

const mappedValue = computed({
  get() {
    return modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const mappedStandin = computed(() => {
  return (
    options.find((option) => option.value === modelValue)?.label || placeholder
  )
})

const filled = computed(() => !!modelValue)

// Private functions
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
    selectRef.value?.focus()
  }
}

defineExpose({
  focus,
})
</script>
