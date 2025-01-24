<template>
  <primitive
    class="magic-cookie-button"
    as="button"
    :as-child="asChild"
    :data-mode="mode"
    @click="emit('click', $event)"
  >
    <slot />
  </primitive>
</template>

<script lang="ts" setup>
import { Primitive } from '@maas/vue-primitive'

interface MagicCookieButtonProps {
  mode?: 'primary' | 'secondary'
  asChild?: boolean
}

const { mode = 'primary' } = defineProps<MagicCookieButtonProps>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<style>
.magic-cookie-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--magic-cookie-button-width, auto);
  height: var(--magic-cookie-button-height, 3rem);
  border: var(--magic-cookie-button-border-width, 1px) solid currentColor;
  padding: var(--magic-cookie-button-spacing-y, 0)
    var(--magic-cookie-button-spacing-x, 1rem);
  gap: var(--magic-cookie-button-spacing, 1rem);
  border-radius: var(--magic-cookie-button-border-radius, 0);
  backdrop-filter: var(--magic-cookie-button-backdrop-filter, none);
}

.magic-cookie-button[data-mode='primary'] {
  color: var(--magic-cookie-button-primary-color, black);
  background-color: var(--magic-cookie-button-primary-background, white);
  border-color: var(--magic-cookie-button-primary-border-color, transparent);
}

.magic-cookie-button[data-mode='secondary'] {
  color: var(--magic-cookie-button-secondary-color, white);
  background-color: var(--magic-cookie-button-secondary-background, black);
  border-color: var(--magic-cookie-button-secondary-border-color, transparent);
}
</style>
