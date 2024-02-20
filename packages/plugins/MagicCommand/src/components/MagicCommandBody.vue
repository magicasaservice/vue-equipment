<template>
  <div class="magic-command-body" ref="elRef">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { inject, ref, watch, nextTick } from 'vue'
import { useCommandItem } from '../composables/private/useCommandItem'
import { useCommandScroll } from '../composables/private/useCommandScroll'
import { CommandInstanceId } from '../symbols'

const commandId = inject(CommandInstanceId, '')
const elRef = ref<HTMLElement | undefined>(undefined)

const { activeItem } = useCommandItem(commandId)
const { findElement, isElementAbove, isElementBelow, scrollInFromBottom } =
  useCommandScroll(elRef)

watch(activeItem, async (value) => {
  if (!value) return

  nextTick(() => {
    const element = findElement(value)
    if (element) {
      if (isElementAbove(element)) {
        element.scrollIntoView()
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
