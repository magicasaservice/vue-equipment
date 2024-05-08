<template>
  <div class="magic-command-body" ref="elRef">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { inject, ref, watch, nextTick } from 'vue'
import { useMagicKeys } from '@vueuse/core'

import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandScroll } from '../composables/private/useCommandScroll'
import { MagicCommandInstanceId, MagicCommandOptions } from '../symbols'

import type { CommandOptions } from '../types'

const elRef = ref<HTMLElement | undefined>(undefined)

const commandId = inject(MagicCommandInstanceId, '')
const options = inject(MagicCommandOptions, {} as CommandOptions)

const { activeItem, nextItem, prevItem } = useCommandItem(commandId)
const {
  findElement,
  isElementAbove,
  isElementBelow,
  scrollInFromBottom,
  scrollInFromTop,
} = useCommandScroll(elRef)

const keys = useMagicKeys()

const nextTimeout = ref<ReturnType<typeof setTimeout> | undefined>(undefined)
const prevTimeout = ref<ReturnType<typeof setTimeout> | undefined>(undefined)
const nextInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
const prevInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)

if (options.keys?.next) {
  for (const key of options.keys.next) {
    watch(keys[key], (value) => {
      if (value) {
        nextItem(options.loop)
        nextTimeout.value = setTimeout(() => {
          nextInterval.value = setInterval(() => {
            nextItem(options.loop)
          }, 100)
        }, 500)
      } else {
        clearTimeout(nextTimeout.value)
        clearInterval(nextInterval.value)
      }
    })
  }
}

if (options.keys?.prev) {
  for (const key of options.keys.prev) {
    watch(keys[key], (value) => {
      if (value) {
        prevItem(options.loop)
        prevTimeout.value = setTimeout(() => {
          prevInterval.value = setInterval(() => {
            prevItem(options.loop)
          }, 100)
        }, 500)
      } else {
        clearTimeout(prevTimeout.value)
        clearInterval(prevInterval.value)
      }
    })
  }
}

watch(activeItem, async (value) => {
  if (!value) return

  nextTick(() => {
    const element = findElement(value)
    if (element) {
      if (isElementAbove(element)) {
        scrollInFromTop(element)
      } else if (isElementBelow(element)) {
        scrollInFromBottom(element)
      }
    }
  })
})
</script>

<style>
:root {
  --magic-command-body-height: 100%;
  --magic-command-body-overflow-y: auto;
}
.magic-command-body {
  height: var(--magic-command-body-height);
  overflow-y: var(--magic-command-body-overflow-y);
}
</style>
