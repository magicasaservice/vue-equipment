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
      <magic-menu-view :id="ViewId.navDrawer" class="w-full" :initial="true">
        <magic-menu-remote
          :channel-id="ChannelId.navDrawerMenuInitial"
          :trigger="['click']"
          as-child
        >
          <m-button size="xs" mode="ghost" @click="open">
            <i-maas-drawer-bottom-500 />
            <span>Menu</span>
          </m-button>
        </magic-menu-remote>
        <magic-drawer :id="DrawerId.navDrawer" :options="{ focusTrap: false }">
          <div class="scrollbar-none relative h-full w-full overflow-auto">
            <div
              class="bg-surface-high fixed inset-0 -z-10 overflow-hidden rounded-t-2xl"
            />
            <div class="flex w-full flex-col gap-6 pt-4">
              <nav-drawer-handle />
              <auto-size :width="false" :duration="250" :height="animate">
                <template v-for="channel in theme.sidebar">
                  <nav-drawer-menu-channel-nested
                    v-if="!!channel.text"
                    :key="channel.text"
                    :channel="channel"
                  />
                </template>
                <nav-drawer-menu-channel-initial />
              </auto-size>
            </div>
            <nav-drawer-menu-footer class="sticky bottom-0" />
          </div>
        </magic-drawer>
      </magic-menu-view>
    </magic-menu-provider>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onBeforeUnmount } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useMagicDrawer } from '@maas/vue-equipment/plugins/MagicDrawer'
import {
  useMagicEmitter,
  type MagicEmitterEvents,
} from '@maas/vue-equipment/plugins/MagicEmitter'
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

// Enable autosize once drawer opened
const animate = ref(false)
const emitter = useMagicEmitter()

function callback(payload: MagicEmitterEvents['afterEnter']) {
  if (payload === DrawerId.navDrawer) {
    animate.value = !animate.value
  }
}

emitter.on('afterEnter', callback)
emitter.on('afterLeave', callback)

onBeforeUnmount(() => {
  emitter.off('afterEnter', callback)
  emitter.off('afterLeave', callback)
})
</script>

<style>
[data-id='nav-drawer'] {
  --magic-drawer-height: auto;
  --magic-drawer-max-height: calc(100dvh - 8rem);
  --magic-drawer-content-height: auto;
  --magic-drawer-drag-overshoot: 1rem;
}
</style>
