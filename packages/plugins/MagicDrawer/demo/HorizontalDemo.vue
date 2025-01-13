<template>
  <div class="flex justify-center items-center py-12">
    <m-button @click="drawerApi.open"> Open Drawer </m-button>
  </div>
  <magic-drawer :id="id" :options="{ focusTrap: false, position: 'right' }">
    <div class="bg-surface-elevation-base absolute inset-0" />
  </magic-drawer>
</template>

<script setup lang="ts">
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '../src/composables/useMagicDrawer'

const id = 'horizontal-demo'
const drawerApi = useMagicDrawer(id)
</script>

<style>
#horizontal-demo {
  --magic-drawer-height: 100svh;
  --magic-drawer-width: 20rem;
}
</style>
