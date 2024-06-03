<template>
  <teleport :to="`[data-id='magic-command-teleport-${instanceId}']`">
    <div
      class="magic-command-content"
      :data-id="`${viewId}-content`"
      ref="elRef"
    >
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, inject, watch, nextTick, provide } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandScroll } from '../composables/private/useCommandScroll'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandContentId,
  MagicCommandProviderOptions,
} from '../symbols'

const instanceId = inject(MagicCommandInstanceId, undefined)
const viewId = inject(MagicCommandViewId, undefined)

const elRef = ref<HTMLElement | undefined>(undefined)

if (!instanceId) {
  throw new Error(
    'MagicCommandContent must be nested inside MagicCommandProvider'
  )
}

if (!viewId) {
  throw new Error('MagicCommandContent must be nested inside MagicCommandView')
}

const options = inject(MagicCommandProviderOptions, undefined)

const { activeItem, selectNextItem, selectPrevItem } = useCommandItem({
  instanceId,
  viewId,
})

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

if (options?.keys?.next) {
  for (const key of options.keys.next) {
    watch(keys[key], (value) => {
      if (value) {
        selectNextItem(options.loop)
        nextTimeout.value = setTimeout(() => {
          nextInterval.value = setInterval(() => {
            selectNextItem(options.loop)
          }, 100)
        }, 500)
      } else {
        clearTimeout(nextTimeout.value)
        clearInterval(nextInterval.value)
      }
    })
  }
}

if (options?.keys?.prev) {
  for (const key of options.keys.prev) {
    watch(keys[key], (value) => {
      if (value) {
        selectPrevItem(options.loop)
        prevTimeout.value = setTimeout(() => {
          prevInterval.value = setInterval(() => {
            selectPrevItem(options.loop)
          }, 100)
        }, 500)
      } else {
        clearTimeout(prevTimeout.value)
        clearInterval(prevInterval.value)
      }
    })
  }
}

watch(
  activeItem,
  async (value) => {
    if (!value) return

    nextTick(() => {
      const element = findElement(value.id)
      if (element) {
        if (isElementAbove(element)) {
          scrollInFromTop(element)
        } else if (isElementBelow(element)) {
          scrollInFromBottom(element)
        }
      }
    })
  },
  { deep: true }
)

provide(MagicCommandContentId, `${viewId}-content`)
</script>
