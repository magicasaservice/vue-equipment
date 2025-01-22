<template>
  <magic-command-view :initial="true" id="initial-view">
    <magic-command-content class="overflow-auto scrollbar-none">
      <m-menu-item mode="plain" size="sm" disabled class="pointer-events-none">
        <m-menu-item-child>Navigation</m-menu-item-child>
      </m-menu-item>

      <!-- Nested Views -->
      <about-view />
      <project-view />

      <!-- Lists -->
      <filter-list />
      <disciplines-list />
    </magic-command-content>
  </magic-command-view>
</template>

<script lang="ts" setup>
import { MMenuItem, MMenuItemChild } from '@maas/mirror/vue'
import ProjectView from './ProjectView.vue'
import AboutView from './AboutView.vue'
import FilterList from './FilterList.vue'
import DisciplinesList from './DisciplinesList.vue'
</script>
