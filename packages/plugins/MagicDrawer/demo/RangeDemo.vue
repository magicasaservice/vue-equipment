<template>
  <m-button @click="open">Open Drawer</m-button>
  <magic-drawer
    id="magic-drawer-range-demo"
    :options="{
      focusTrap: false,
      snapPoints: [{ min: 0.25, max: 0.75 }, 1],
      initial: { snapPoint: 0.5 },
    }"
  >
    <div class="bg-surface-base absolute inset-0" />
    <div class="relative flex justify-between p-8 font-mono text-sm">
      <span class="text-surface-muted">activeSnapPoint</span>
      <span class="text-surface">{{ activeSnapPoint ?? '–' }}</span>
    </div>
  </magic-drawer>
</template>

<script lang="ts" setup>
import { MButton } from 'mirror-compat'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'

const { open, activeSnapPoint } = useMagicDrawer('magic-drawer-range-demo')
</script>

<style>
[data-id='magic-drawer-range-demo'] {
  --magic-drawer-height: 100svh;
}
</style>
