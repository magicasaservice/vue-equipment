<template>
  <div class="flex justify-center items-center py-12">
    <m-button @click="drawerApi.open"> Open Drawer </m-button>
  </div>
  <magic-drawer
    :id="id"
    :options="{
      focusTrap: false,
      snapPoints: snapPoints,
      initial: { snapPoint: snapPoints[0] },
    }"
  >
    <div class="bg-surface-elevation-base absolute inset-0" />
  </magic-drawer>
</template>

<script setup lang="ts">
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

const id = 'snap-points-demo'
const snapPoints = ['320px', 0.75, 1]

const drawerApi = useMagicDrawer(id)
</script>

<style>
#snap-points-demo {
  --magic-drawer-height: 100svh;
}
</style>
