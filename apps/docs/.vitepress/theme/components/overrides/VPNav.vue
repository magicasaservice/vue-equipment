<template>
  <header class="vp-nav-override fixed top-0 z-50 w-full backdrop-blur-xl">
    <div class="flex w-full items-center justify-between px-6 md:px-8">
      <VPNavBarTitle class="w-52" />
      <div class="flex gap-12">
        <nav-menu-bar class="hidden sm:block" />
        <div class="flex gap-3">
          <nav-color-mode-switch />
          <nav-drawer class="block sm:hidden" />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import VPNavBarTitle from 'vitepress/dist/client/theme-default/components/VPNavBarTitle.vue'
import NavColorModeSwitch from '../NavColorModeSwitch.vue'
import NavMenuBar from '../NavMenuBar.vue'
import NavDrawer from '../NavDrawer.vue'
</script>
