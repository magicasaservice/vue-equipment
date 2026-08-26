<template>
  <field-root
    as="label"
    :class="[
      'm-toggle',
      `-${size}`,
      `-${mode}`,
      {
        '-disabled': disabled,
        '-reverse': reverse,
        '-icon-checked': iconChecked,
        '-icon-unchecked': iconUnchecked,
      },
    ]"
    :disabled="disabled"
  >
    <div class="m-toggle__checkbox">
      <switch-root
        :id="mappedId"
        class="m-toggle__control"
        :disabled="disabled"
        :model-value="mappedValue"
        @update:model-value="emit('update:modelValue', $event)"
      >
        <switch-thumb as="div" class="m-toggle__handle">
          <span v-if="$slots.checked && modelValue">
            <slot name="checked" />
          </span>
          <span v-if="$slots.unchecked && !modelValue">
            <slot name="unchecked" />
          </span>
        </switch-thumb>
      </switch-root>
    </div>
    <slot name="label">
      <label-root v-if="label" as="span" :for="mappedId" :native-label="false">
        {{ label }}
      </label-root>
    </slot>
  </field-root>
</template>

<script lang="ts" setup>
/* eslint-disable vue/no-required-prop-with-default -- v1's shape, verbatim */
import { computed, useId } from 'vue'
import {
  FieldRoot,
  Label as LabelRoot,
  SwitchRoot,
  SwitchThumb,
} from '@maas/mirror/vue'

// `IToggleProps`, verbatim
interface MToggleProps {
  modelValue: boolean | 'indeterminate'
  id?: string
  label?: string
  mode?: 'solid' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  reverse?: boolean
  iconChecked?: boolean
  iconUnchecked?: boolean
  disabled?: boolean
}

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

const emit = defineEmits<{
  (e: 'update:modelValue', value: MToggleProps['modelValue']): void
  (e: 'blur' | 'focus'): void
}>()

// Private state
const generatedId = useId()

// Public state
const mappedId = computed(() => (id ? id : generatedId))

// `Switch` has no indeterminate state, and neither did the `<input>` v1
// rendered; `'indeterminate'` was only ever truthy there
const mappedValue = computed(() => !!modelValue)
</script>
