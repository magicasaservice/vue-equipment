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

interface MagicAutoSizeProps {
  width?: boolean
  height?: boolean
}

const props = withDefaults(defineProps<MagicAutoSizeProps>(), {
  width: true,
  height: true,
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

useMutationObserver(
  elRef,
  (mutations) => {
    const filtered = mutations
      .flatMap((m) => [...m.addedNodes])
      .find((n) => n instanceof HTMLElement)

    if (!!filtered && filtered instanceof HTMLElement) {
      content.value = filtered
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
      width: content.value.offsetWidth,
      height: content.value.offsetHeight,
    }
  }
})

onMounted(() => {
  if (elRef.value) {
    const content = elRef.value.querySelectorAll('*')
    const filtered = Array.from(content).find(
      (node) => node instanceof HTMLElement
    )

    if (!!filtered && filtered instanceof HTMLElement) {
      size.value = {
        width: filtered.offsetWidth,
        height: filtered.offsetHeight,
      }
    }
  }
})
</script>

<style>
.magic-auto-size {
  --magic-auto-size-transition-function: ease;
  --magic-auto-size-transition-duration: 100ms;

  transition: all var(--magic-auto-size-transition-duration)
    var(--magic-auto-size-transition-function);
  width: var(--magic-auto-size-width);
  height: var(--magic-auto-size-height);
}
</style>
