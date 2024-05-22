<template>
  <teleport to="body" v-if="wrapperActive">
    <transition :name="mappedTransition">
      <div
        class="magic-menu-content"
        :id="`${viewId}-content`"
        v-if="innerActive"
      >
        <magic-menu-float :placement="placement">
          <div class="magic-menu-content__inner" @mouseenter="onMouseenter">
            <slot />
          </div>
        </magic-menu-float>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, inject, provide, nextTick, watch, computed } from 'vue'
import type { Placement } from '@floating-ui/vue'
import { useMenuView } from '../composables/private/useMenuView'
import {
  MagicMenuInstanceId,
  MagicMenuViewId,
  MagicMenuContentId,
} from '../symbols'

import '@maas/vue-equipment/utils/css/animations/fade-in.css'
import '@maas/vue-equipment/utils/css/animations/fade-out.css'
import { useMenuState } from '../composables/private/useMenuState'

interface MagicMenuContentProps {
  placement?: Placement
}

defineProps<MagicMenuContentProps>()

const instanceId = inject(MagicMenuInstanceId, undefined)
const viewId = inject(MagicMenuViewId, undefined)

if (!instanceId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuProvider')
}

if (!viewId) {
  throw new Error('MagicMenuContent must be nested inside MagicMenuView')
}

const { getView, selectView } = useMenuView(instanceId)
const view = getView(viewId)

const { initializeState } = useMenuState(instanceId)
const state = initializeState()

// TODO: Find a better solution for this
function onMouseenter() {
  if (viewId) {
    selectView(viewId)
  }
}

const mappedTransition = computed(() => {
  switch (state.options.mode) {
    case 'menubar':
      return state.active ? '' : 'magic-menu-content'
    case 'dropdown':
      return state.active ? '' : 'magic-menu-content'
    default:
      return state.active ? '' : 'magic-menu-content'
  }
})

// Split isActive into two values to animate content smoothly
const innerActive = ref(false)
const wrapperActive = ref(false)

// Handle state
async function onOpen() {
  wrapperActive.value = true
  await nextTick()
  innerActive.value = true
}

async function onClose() {
  innerActive.value = false
  await nextTick()
  wrapperActive.value = false
}

watch(
  () => view?.active,
  async (value) => {
    if (value) {
      await onOpen()
    } else {
      onClose()
    }
  }
)

provide(MagicMenuContentId, `${viewId}-content`)
</script>

<style>
.magic-menu-content-leave-active {
  animation: fade-out 150ms ease;
}
</style>
