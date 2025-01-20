<template>
  <teleport :to="state.renderer" v-if="isActive">
    <div
      :class="['magic-command-content', props.class]"
      :data-id="`${viewId}-content`"
      :data-idle="isIdle"
      ref="elRef"
    >
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, inject, watch, nextTick, provide, computed } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandScroll } from '../composables/private/useCommandScroll'
import {
  MagicCommandInstanceId,
  MagicCommandViewId,
  MagicCommandContentId,
  MagicCommandProviderOptions,
} from '../symbols'
import { useCommandView } from '../composables/private/useCommandView'
import { useCommandState } from '../composables/private/useCommandState'

interface MagicCommandContentProps {
  class?: string
}

const props = defineProps<MagicCommandContentProps>()

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

const { getView } = useCommandView(instanceId)
const view = getView(viewId)

const { initializeState } = useCommandState(instanceId)
const state = initializeState()

const isActive = computed(() => view?.active && state.renderer)
const isIdle = computed(() => state.input.view !== viewId)

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

if (options?.keyListener?.next) {
  for (const key of options.keyListener.next) {
    watch(keys[key], (value) => {
      if (isIdle.value) {
        return
      }

      if (value) {
        state.input.type === 'keyboard'

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

if (options?.keyListener?.prev) {
  for (const key of options.keyListener.prev) {
    watch(keys[key], (value) => {
      if (isIdle.value) {
        return
      }

      if (value) {
        state.input.type === 'keyboard'

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
    if (!value || isIdle.value) return

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

<style>
.magic-command-content {
  position: absolute;
  inset: 0;
}

.magic-command-content[data-idle='true'] {
  opacity: var(--magic-command-content-idle-opacity, 0);
  pointer-events: none;
}
</style>
