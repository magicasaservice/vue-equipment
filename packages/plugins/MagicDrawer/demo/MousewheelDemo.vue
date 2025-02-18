<template>
  <m-button @click="drawerApi.open">Open Drawer</m-button>
  <magic-drawer
    id="magic-drawer-mousewheel-demo"
    :options="{ focusTrap: false, enableMousewheel: true }"
  >
    <div class="bg-surface-elevation-base absolute inset-0" />
  </magic-drawer>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'

const drawerApi = useMagicDrawer('magic-drawer-mousewheel-demo')
</script>
