<template>
  <div class="w-full">
    <magic-menu-provider
      :id="MenuId.navDrawer"
      :options="{
        mode: 'navigation',
        transition: {
          content: { default: 'none' },
        },
      }"
      class="w-full"
    >
      <magic-menu-view class="w-full" :initial="true" :id="ViewId.navDrawer">
        <m-button size="xs" square icon mode="translucent" @click="open">
          <magic-menu-remote
            :channel-id="ChannelId.navDrawerMenuInitial"
            :trigger="['click']"
          >
            <i-maas-menu-500 />
          </magic-menu-remote>
        </m-button>
        <magic-drawer :id="DrawerId.navDrawer" :options="{ focusTrap: false }">
          <div
            class="scrollbar-none rounded-t-surface-sm relative h-full w-full overflow-auto overscroll-none"
          >
            <div
              class="bg-surface-elevation-high rounded-t-surface-sm fixed inset-0 -z-10 overflow-hidden"
            />
            <div class="flex w-full flex-col gap-6 pt-6">
              <nav-drawer-handle />
              <auto-size :width="false" :duration="200">
                <nav-drawer-menu-channel-nested
                  v-for="channel in theme.sidebar"
                  :key="channel.text"
                  :channel="channel"
                />
                <nav-drawer-menu-channel-initial />
              </auto-size>
            </div>
            <nav-drawer-menu-footer
              class="sticky bottom-0 -mt-[var(--magic-drawer-drag-overshoot)] translate-y-[var(--magic-drawer-drag-overshoot)]"
            />
          </div>
        </magic-drawer>
      </magic-menu-view>
    </magic-menu-provider>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useMagicDrawer } from '@maas/vue-equipment/plugins'
import { AutoSize } from '@maas/vue-autosize'
import { DrawerId, MenuId, ChannelId, ViewId } from '../utils/enums'

import NavDrawerHandle from './NavDrawerHandle.vue'
import NavDrawerMenuChannelNested from './NavDrawerMenuChannelNested.vue'
import NavDrawerMenuChannelInitial from './NavDrawerMenuChannelInitial.vue'
import NavDrawerMenuFooter from './NavDrawerMenuFooter.vue'

const { open, close } = useMagicDrawer(DrawerId.navDrawer)
const { theme } = useData()

const route = useRoute()

watch(
  () => route.path,
  () => {
    close()
  }
)
</script>

<style>
[data-id='nav-drawer'] {
  --magic-drawer-height: auto;
  --magic-drawer-max-height: calc(100dvh - 4rem);
  --magic-drawer-content-height: auto;
  --magic-drawer-drag-overshoot: 1rem;
}
</style>
