<template>
  <m-toggle
    v-model="isDark"
    class="nav-color-mode-switch"
    @click="toggleMode"
    size="sm"
  >
    <template #checked>
      <i-maas-moon-500 />
    </template>
    <template #unchecked>
      <i-maas-sun-500 />
    </template>
  </m-toggle>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue'
import { useData } from 'vitepress'
import { MToggle } from '@maas/mirror/vue'

const { isDark } = useData()

function toggleMode() {
  setMode(isDark.value ? 'light' : 'dark')
}

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
