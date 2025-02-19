<template>
  <magic-menu-channel
    :id="ChannelId.navDrawerMenuInitial"
    :initial="true"
    class="nav-drawer-menu-channel-initial flex w-full flex-col gap-4"
  >
    <div class="flex w-full flex-col gap-1 px-2">
      <nav-drawer-menu-remote
        v-for="channel in theme.sidebar"
        :channel="channel"
      />
    </div>
  </magic-menu-channel>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import { ChannelId } from '../utils/enums'
import NavDrawerMenuRemote from './NavDrawerMenuRemote.vue'

const { theme } = useData()
</script>
