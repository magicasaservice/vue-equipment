<template>
  <m-button @click="drawerApi.open">Open Drawer</m-button>
  <magic-drawer
    id="magic-drawer-snap-mode-demo"
    :options="{
      focusTrap: false,
      snapPoints: snapPoints,
      snap: { mode: 'step' },
      initial: { snapPoint: snapPoints[0] },
    }"
  >
    <div class="bg-surface-base absolute inset-0" />
  </magic-drawer>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'

const snapPoints = [0.25, 0.5, 0.75, 1]
const drawerApi = useMagicDrawer('magic-drawer-snap-mode-demo')
</script>

<style>
[data-id='magic-drawer-snap-mode-demo'] {
  --magic-drawer-height: 100svh;
}
</style>
