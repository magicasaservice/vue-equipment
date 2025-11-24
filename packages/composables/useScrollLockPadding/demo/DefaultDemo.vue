<template>
  <div class="flex w-full flex-col items-center gap-8">
    <m-button @click="toggle">
      {{ scrollLock ? 'Unlock Scroll' : 'Lock Scroll' }}
    </m-button>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useScrollLock } from '@vueuse/core'
import { useScrollLockPadding } from '@maas/vue-equipment/composables/useScrollLockPadding'

const { add, remove } = useScrollLockPadding()

const scrollLock =
  typeof window !== 'undefined'
    ? useScrollLock(document?.documentElement)
    : shallowRef(false)

function toggle() {
  if (!scrollLock.value) {
    scrollLock.value = true
    add()
  } else {
    scrollLock.value = false
    remove()
  }
}
</script>
