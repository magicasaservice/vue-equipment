<template>
  <div
    class="magic-auto-size"
    ref="elRef"
    :style="{
      '--magic-auto-size-width': mappedSize?.width,
      '--magic-auto-size-height': mappedSize?.height,
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useResizeObserver, useMutationObserver } from '@vueuse/core'

import '@maas/vue-equipment/utils/css/easings.css'

interface MagicAutoSizeProps {
  width?: boolean
  height?: boolean
  immediate?: boolean
}

const props = withDefaults(defineProps<MagicAutoSizeProps>(), {
  width: true,
  height: true,
  immediate: false,
})

const elRef = ref<HTMLElement | undefined>(undefined)

const size = ref<{ width: number; height: number }>()
const content = ref<HTMLElement | undefined>(undefined)

const mappedSize = computed(() => {
  if (size.value) {
    switch (true) {
      case props.width && props.height:
        return {
          width: `${size.value.width}px`,
          height: `${size.value.height}px`,
        }
      case props.width:
        return {
          width: `${size.value.width}px`,
        }
      case props.height:
        return {
          height: `${size.value.height}px`,
        }
    }
  } else {
    return undefined
  }
})

const padding = computed(() => {
  if (elRef.value) {
    const style = getComputedStyle(elRef.value, null)
    const top = parseFloat(style.getPropertyValue('padding-top'))
    const left = parseFloat(style.getPropertyValue('padding-left'))
    const right = parseFloat(style.getPropertyValue('padding-right'))
    const bottom = parseFloat(style.getPropertyValue('padding-bottom'))
    return { x: right + left, y: top + bottom }
  } else {
    return { x: 0, y: 0 }
  }
})

const child = computed(() => {
  return Array.from(elRef.value?.childNodes ?? []).find(
    (n) => n instanceof HTMLElement
  )
})

useMutationObserver(
  elRef,
  (mutations) => {
    const addedNode = mutations
      .flatMap((m) => [...m.addedNodes])
      .find((n) => n instanceof HTMLElement)

    const addedComment = mutations
      .flatMap((m) => [...m.addedNodes])
      .find((n) => n instanceof Comment)

    if (!!addedNode && addedNode instanceof HTMLElement) {
      content.value = addedNode
    }

    // If immediate is true, reset the size when a comment is added
    // Vue sets a placeholder comment for a v-if
    if (props.immediate && !!addedComment) {
      content.value = undefined
      size.value = {
        width: 0,
        height: 0,
      }
    }

    // If the node is removed, reset the size
    if (!child.value) {
      content.value = undefined
      size.value = {
        width: 0,
        height: 0,
      }
    }
  },
  {
    childList: true,
    subtree: true,
  }
)

useResizeObserver(content, () => {
  if (content.value) {
    size.value = {
      width: content.value.offsetWidth + padding.value.x,
      height: content.value.offsetHeight + padding.value.y,
    }
  }
})

onMounted(() => {
  if (elRef.value) {
    const elements = elRef.value.querySelectorAll('*')
    const filtered = Array.from(elements).find(
      (node) => node instanceof HTMLElement
    )

    if (!!filtered && filtered instanceof HTMLElement) {
      content.value = filtered
      size.value = {
        width: filtered.offsetWidth + padding.value.x,
        height: filtered.offsetHeight + padding.value.y,
      }
    } else {
      size.value = {
        width: 0,
        height: 0,
      }
    }
  }
})
</script>

<style>
.magic-auto-size {
  transition: var(--magic-auto-size-transition, all 150ms var(--ease-in-out));
  width: var(--magic-auto-size-width);
  height: var(--magic-auto-size-height);
}
</style>
