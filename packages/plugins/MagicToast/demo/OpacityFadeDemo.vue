<template>
  <div class="flex w-full gap-2">
    <m-button @click="onClick">Add Toast</m-button>
  </div>
  <magic-toast-provider
    :id="id"
    :options="{
      position: 'bottom-right',
      threshold: { distance: dismissThreshold },
      layout: { expand: false, max: 1 },
      initial: { expanded: true },
    }"
  />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, reactive, onBeforeUnmount } from 'vue'
import { MButton } from '@maas/mirror/vue'
import { useMagicToast } from '@maas/vue-equipment/plugins/MagicToast'
import { useMagicEmitter } from '@maas/vue-equipment/plugins/MagicEmitter'
import type { MagicEmitterEvents } from '@maas/vue-equipment/plugins/MagicEmitter'

const id = 'magic-toast-opacity-fade-demo'
const component = defineAsyncComponent(
  () => import('./components/FadeDemoToast.vue')
)

const { add } = useMagicToast(id)
const emitter = useMagicEmitter()

// Distance that dismisses the toast; the fade spans four times that
const dismissThreshold = 60
const fadeDistance = dismissThreshold * 4

const props = reactive({ message: 'Drag me away to fade me out', opacity: 1 })

// drag is shared across plugins, so the payload is a union — narrow it to the
// x/y shape before use. Derive opacity from the drag distance and reset it once
// the drag ends, entirely through the emitter — the toast no longer fades on its own.
function onDrag(payload: MagicEmitterEvents['drag']) {
  if (payload.id !== id || !('x' in payload)) {
    return
  }

  const distance = Math.max(Math.abs(payload.x), Math.abs(payload.y))
  props.opacity = 1 - Math.min(distance / fadeDistance, 1)
}

function onAfterDrag(payload: MagicEmitterEvents['afterDrag']) {
  if (payload.id !== id || !('x' in payload)) {
    return
  }

  props.opacity = 1
}

emitter.on('drag', onDrag)
emitter.on('afterDrag', onAfterDrag)

onBeforeUnmount(() => {
  emitter.off('drag', onDrag)
  emitter.off('afterDrag', onAfterDrag)
})

function onClick() {
  add({ component, props })
}
</script>
