<template>
  <m-button @click="drawerApi.open"> Open Drawer </m-button>
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

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'

const id = 'snap-points-demo'
const snapPoints = ['320px', 0.75, 1]

const drawerApi = useMagicDrawer(id)
</script>

<style>
#snap-points-demo {
  --magic-drawer-height: 100svh;
}
</style>
