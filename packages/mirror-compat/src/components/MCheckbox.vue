<template>
  <field-root
    as="label"
    :class="[
      'm-checkbox',
      `-${size}`,
      `-${mode}`,
      { '-disabled': disabled, '-reverse': reverse, '-error': error },
    ]"
    :aria-disabled="disabled"
    :disabled="disabled"
    :invalid="error || undefined"
  >
    <checkbox-root
      :id="mappedId"
      class="m-checkbox__control"
      :aria-invalid="error || undefined"
      :indeterminate="modelValue === 'indeterminate'"
      :model-value="modelValue === 'indeterminate' ? false : modelValue"
      :options="{ disabled }"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <slot name="label">
      <label-root as="span" :for="mappedId" :native-label="false">
        {{ label }}
      </label-root>
    </slot>
  </field-root>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-required-prop-with-default -- v1's shape, verbatim */
import { computed, useId } from 'vue'
import { CheckboxRoot, FieldRoot, Label as LabelRoot } from '@maas/mirror/vue'

// `ICheckboxProps`, verbatim
interface MCheckboxProps {
  modelValue: boolean | 'indeterminate'
  id?: string
  label?: string
  mode?: 'solid' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  reverse?: boolean
  disabled?: boolean
  error?: boolean
}

const {
  modelValue = false,
  id = '',
  label = 'Label',
  mode = 'solid',
  size = 'md',
  reverse = false,
  disabled = false,
  error = false,
} = defineProps<MCheckboxProps>()

// `blur` and `focus` are declared because v1 declares them. v1 never emits
// them either: declaring them strips the listeners out of `$attrs`, which is
// why `@focus` on a v1 `m-checkbox` has never fired. Reproduced, not fixed.
const emit = defineEmits<{
  (e: 'update:modelValue', value: MCheckboxProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

// Private state
const generatedId = useId()

// Public state
const mappedId = computed(() => (id ? id : generatedId))
</script>
