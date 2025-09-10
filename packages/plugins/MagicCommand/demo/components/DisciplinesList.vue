<template>
  <m-menu-item mode="ghost" size="sm" disabled class="pointer-events-none">
    <m-menu-item-child>Disciplines</m-menu-item-child>
  </m-menu-item>
  <magic-command-item
    v-for="discipline in disciplines"
    :key="discipline.id"
    v-slot="{ itemActive }"
    as-child
  >
    <m-menu-item mode="ghost" size="sm" :selected="itemActive">
      <m-menu-item-child>{{ discipline.name }}</m-menu-item-child>
    </m-menu-item>
  </magic-command-item>
</template>

<script lang="ts" setup>
import { MMenuItem, MMenuItemChild } from '@maas/mirror/vue'
import { disciplines } from '../data/search.json'
</script>
