<template>
  <header class="vp-nav-override fixed top-0 z-50 w-full backdrop-blur-xl">
    <div class="flex w-full items-center justify-between px-6 md:px-8">
      <VPNavBarTitle class="w-52" />
      <div class="flex gap-10">
        <nav-menu-bar class="hidden sm:block" />
        <div class="flex gap-1">
          <nav-drawer class="block sm:hidden" />
          <nav-color-mode-switch class="block sm:hidden" />
          <m-button
            size="xs"
            mode="ghost"
            square
            icon
            as-child
            v-for="item in theme.socialLinks"
            :key="item.link"
            class="shrink-0"
          >
            <a :href="item.link" rel="noopener noreferrer" target="_blank">
              <i-maas-brand-github-500 v-if="item.icon === 'github'" />
              <i-maas-brand-bluesky-500 v-if="item.icon === 'bluesky'" />
              <i-maas-maas-robot-500 v-if="item.icon === 'maas'" />
            </a>
          </m-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import VPNavBarTitle from 'vitepress/dist/client/theme-default/components/VPNavBarTitle.vue'
import NavColorModeSwitch from '../NavColorModeSwitch.vue'
import NavMenuBar from '../NavMenuBar.vue'
import NavDrawer from '../NavDrawer.vue'

const { theme } = useData()
</script>
