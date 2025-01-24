<template>
  <div class="magic-cookie-checkbox" :data-disabled="cookie.optional === false">
    <input
      :id="cookie.key"
      type="checkbox"
      :checked="cookie.value"
      :disabled="cookie.optional === false"
      @change="emit('change', cookie.key)"
    />
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { MagicCookieId } from '../../symbols'
import type { MagicCookie } from '../types'

const id = inject(MagicCookieId, undefined)

if (!id) {
  throw new Error('MagicCookieCheckbox must be used inside MagicCookie')
}

interface MagicCookieCheckbox {
  cookie: MagicCookie
}

defineProps<MagicCookieCheckbox>()

const emit = defineEmits<{
  (e: 'change', key: string): void
}>()
</script>

<style>
.magic-cookie-checkbox {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}

.magic-cookie-checkbox input[type='checkbox'] {
  position: relative;
  flex-shrink: 0;
  width: var(--magic-cookie-checkbox-size, 0.875rem);
  height: var(--magic-cookie-checkbox-size, 0.875rem);
  background-color: transparent;
  border: var(--magic-cookie-checkbox-border-width, 1px)
    var(--magic-cookie-checkbox-border-color, currentColor) solid;
  vertical-align: middle;
  cursor: pointer;
  appearance: none;
  border-radius: var(--magic-cookie-checkbox-border-radius, 0);
}

.magic-cookie-checkbox input[type='checkbox']:checked::after {
  content: '';
  display: block;
  position: absolute;
  width: calc(var(--magic-cookie-checkbox-size, 0.875rem) / 2);
  height: calc(var(--magic-cookie-checkbox-size, 0.875rem) / 2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--magic-cookie-checkbox-border-color, currentColor);
  border-radius: var(--magic-cookie-checkbox-border-radius, 0);
}

.magic-cookie-checkbox[data-disabled='true'] {
  cursor: not-allowed;
  & input[type='checkbox'] {
    pointer-events: none;
  }
}
</style>
