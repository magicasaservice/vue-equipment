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
      <VPLink :href="item.link" v-for="item in channel.items" :key="item.text">
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
@keyframes nested-channel-in {
  0% {
    opacity: 0%;
  }

  50% {
    opacity: 0%;
  }

  100% {
    opacity: 100%;
  }
}

.nested-channel-enter-active {
  animation: fade-in 200ms ease;
}

.nested-channel-leave-active {
  animation: fade-out 300ms ease;
  position: absolute;
  top: 3.375rem;
}
</style>
