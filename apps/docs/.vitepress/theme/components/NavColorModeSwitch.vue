<template>
  <magic-menu-provider
    :id="MenuId.navColorModeSwitch"
    :options="{
      mode: 'dropdown',
      scrollLock: false,
    }"
    class="nav-color-mode-switch"
  >
    <magic-menu-view :id="ViewId.navColorModeSwitch" v-slot="{ viewActive }">
      <m-button as-child size="xs" :mode="viewActive ? 'translucent' : 'ghost'">
        <magic-menu-trigger>
          <i-maas-moon-500 v-if="isDark" />
          <i-maas-sun-500 v-else-if="!isDark" />
          <span>{{ currentColorMode }}</span>
        </magic-menu-trigger>
      </m-button>
      <magic-menu-content :arrow="false" placement="bottom">
        <div class="px-2 py-1">
          <m-menu-box size="xs">
            <magic-menu-item @click="setMode('dark')">
              <m-menu-item mode="subtle" :active="isDark">
                <template #start>
                  <m-menu-item-child start>
                    <i-maas-check-500 v-if="isDark" />
                    <i-maas-spacer-500 v-else />
                    <i-maas-moon-500 />
                  </m-menu-item-child>
                </template>
                <m-menu-item-child end>Dark</m-menu-item-child>
              </m-menu-item>
            </magic-menu-item>
            <magic-menu-item @click="setMode('light')">
              <m-menu-item mode="subtle" :active="!isDark">
                <template #start>
                  <m-menu-item-child start>
                    <i-maas-check-500 v-if="!isDark" />
                    <i-maas-spacer-500 v-else />
                    <i-maas-sun-500 />
                  </m-menu-item-child>
                </template>
                <m-menu-item-child end>Light</m-menu-item-child>
              </m-menu-item>
            </magic-menu-item>
          </m-menu-box>
        </div>
      </magic-menu-content>
    </magic-menu-view>
  </magic-menu-provider>
</template>

<script lang="ts" setup>
import { computed, nextTick } from 'vue'
import { useData } from 'vitepress'
import { MButton, MMenuItem, MMenuItemChild, MMenuBox } from '@maas/mirror/vue'
import { MenuId, ViewId } from '../utils/enums'

const { isDark } = useData()

const currentColorMode = computed(() => (isDark.value ? 'Dark' : 'Light'))

async function setMode(mode: 'dark' | 'light') {
  // Prevent transition when changing color mode
  // https://paco.me/writing/disable-theme-transitions
  const css = document.createElement('style')
  css.type = 'text/css'
  css.appendChild(
    document.createTextNode(
      `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`
    )
  )

  document.head.appendChild(css)

  // Calling getComputedStyle forces the browser to redraw
  // eslint-disable-next-line
  const _ = window.getComputedStyle(css).opacity
  await new Promise((resolve) => requestAnimationFrame(resolve))

  console.log('Setting color mode:', mode)

  switch (mode) {
    case 'dark':
      isDark.value = true
      break
    case 'light':
      isDark.value = false
      break
  }

  await nextTick()

  // Calling getComputedStyle forces the browser to redraw
  // eslint-disable-next-line
  const __ = window.getComputedStyle(css).opacity
  document.head.removeChild(css)
}
</script>
