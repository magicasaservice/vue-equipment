<template>
  <m-button @click="drawerApi.open">Open Drawer</m-button>
  <magic-drawer
    id="magic-drawer-horizontal-demo"
    :options="{ focusTrap: false, position: 'right' }"
  >
    <div class="bg-surface-elevation-base absolute inset-0" />
  </magic-drawer>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'

const drawerApi = useMagicDrawer('magic-drawer-horizontal-demo')
</script>

<style>
#magic-drawer-horizontal-demo {
  --magic-drawer-height: 100svh;
  --magic-drawer-width: 20rem;
}
</style>
