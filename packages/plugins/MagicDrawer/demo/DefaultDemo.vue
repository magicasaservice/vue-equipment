<template>
  <m-button @click="drawerApi.open">Open Drawer</m-button>
  <magic-drawer id="magic-drawer-demo" :options="{ focusTrap: false }">
    <div class="bg-surface-base absolute inset-0" />
  </magic-drawer>
</template>

<script lang="ts" setup>
import { MButton } from '@maas/mirror/vue'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'

const drawerApi = useMagicDrawer('magic-drawer-demo')
</script>
