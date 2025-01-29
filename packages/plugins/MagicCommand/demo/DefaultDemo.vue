<template>
  <magic-command-provider id="magic-command-demo">
    <magic-command-trigger view-id="initial-default-view" as-child>
      <m-button>Open Menu</m-button>
    </magic-command-trigger>

    <magic-command-modal :options="{ focusTrap: false }">
      <m-menu-box class="w-[40rem] h-[30rem]">
        <magic-command-renderer />
      </m-menu-box>
    </magic-command-modal>

    <default-view id="initial-default-view" />
  </magic-command-provider>
</template>

<script lang="ts" setup>
import { MButton, MMenuBox } from '@maas/mirror/vue'
import DefaultView from './components/DefaultView.vue'
</script>
