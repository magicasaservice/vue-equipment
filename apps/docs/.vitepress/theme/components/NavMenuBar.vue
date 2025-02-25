<template>
  <magic-menu-provider
    :id="MenuId.navMenuBar"
    :options="{
      scrollLock: false,
      floating: {
        strategy: 'fixed',
      },
    }"
  >
    <div class="flex items-center gap-2">
      <template v-for="entry in theme.nav">
        <m-button v-if="entry.link" size="xs" mode="ghost">
          <VPLink :href="entry.link">
            {{ entry.text }}
          </VPLink>
        </m-button>
        <magic-menu-view v-else-if="entry.items" placement="bottom-center">
          <magic-menu-trigger as-child :trigger="['mouseenter']">
            <m-button size="xs" mode="ghost">{{ entry.text }}</m-button>
          </magic-menu-trigger>
          <magic-menu-content>
            <div class="p-1">
              <m-menu-box size="xs" class="max-w-[9rem]">
                <VPLink :href="item.link" v-for="item in entry.items">
                  <m-menu-item to="/" size="xs">
                    <m-menu-item-child>{{ item.text }}</m-menu-item-child>
                  </m-menu-item>
                </VPLink>
              </m-menu-box>
            </div>
          </magic-menu-content>
        </magic-menu-view>
      </template>
      <nav-inline-color-mode-switch />
    </div>
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import { MenuId } from '../utils/enums'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import NavInlineColorModeSwitch from './NavInlineColorModeSwitch.vue'

const { theme } = useData()
</script>
