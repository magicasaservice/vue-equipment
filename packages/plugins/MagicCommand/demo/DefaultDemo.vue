<template>
  <magic-command-provider id="magic-command-default-demo">
    <magic-command-trigger :view-id="viewId" as-child>
      <m-button>Open Menu</m-button>
    </magic-command-trigger>

    <magic-command-modal :options="{ focusTrap: false }">
      <m-menu-box class="w-[40rem] h-[30rem]">
        <magic-command-renderer />
      </m-menu-box>
    </magic-command-modal>

    <default-view :id="viewId" />
  </magic-command-provider>
</template>

<script lang="ts" setup>
import { MButton, MMenuBox } from '@maas/mirror/vue'
import DefaultView from './components/DefaultView.vue'

const viewId = 'initial-default-view'
</script>
