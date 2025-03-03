<template>
  <magic-menu-channel
    :id="kebabCase(channel.text)"
    transition="nested-channel"
    class="mobile-menu-channel-nested flex w-full flex-col gap-4"
  >
    <div class="w-full px-4">
      <m-button block mode="translucent" as-child>
        <magic-menu-remote
          :channel-id="ChannelId.navDrawerMenuInitial"
          :trigger="['click']"
        >
          <i-maas-chevron-w-500 />
          <span>{{ channel.text }}</span>
        </magic-menu-remote>
      </m-button>
    </div>
    <div class="flex w-full flex-col justify-between gap-1 px-2">
      <VPLink v-for="item in channel.items" :key="item.text" :href="item.link">
        <m-menu-item>
          <m-menu-item-child>{{ item.text }}</m-menu-item-child>
        </m-menu-item>
      </VPLink>
    </div>
  </magic-menu-channel>
</template>

<script setup lang="ts">
import { kebabCase } from 'scule'
import { ChannelId } from '../utils/enums'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'

interface NavDrawerMenuChannelNestedProps {
  channel: {
    text: string
    items: {
      text: string
      link: string
    }[]
  }
}

defineProps<NavDrawerMenuChannelNestedProps>()
</script>

<style>
.nested-channel-enter-active {
  animation: fade-up-in 250ms ease;
  position: absolute;
}

.nested-channel-leave-active {
  animation: fade-out 250ms ease;
  position: absolute;
}
</style>
