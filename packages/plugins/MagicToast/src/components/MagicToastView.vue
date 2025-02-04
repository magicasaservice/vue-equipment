<template>
  <li
    :id="id"
    ref="elRef"
    class="magic-toast-view"
    :data-expanded="state.expanded"
    :data-dragging="view.dragging"
  >
    <div
      class="magic-toast-view__inner"
      @pointerdown="onPointerdown"
      @click="onClick"
    >
      <div :style="style">
        <slot />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watchEffect, watch, inject } from 'vue'
import { MagicToastInstanceId } from '../../symbols'
import { useToastState } from '../composables/private/useToastState'
import { useMagicToast } from '../composables/useMagicToast'
import { useToastDrag } from '../composables/private/useToastDrag'

import '@maas/vue-equipment/utils/css/transitions/fade.css'

interface MagicToastViewProps {
  id: string
  index: number
}

const { id, index } = defineProps<MagicToastViewProps>()

const instanceId = inject(MagicToastInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicToastView must be used inside MagicToastProvider')
}

const { initializeState } = useToastState(instanceId)
const state = initializeState()

const { count } = useMagicToast(instanceId)

const elRef = ref<HTMLElement | undefined>(undefined)

const view = computed(() => state.views[index])

const { style, onPointerdown, onClick } = useToastDrag({
  view: view.value,
  instanceId,
})

function setIndex() {
  const newIndex = (count.value - index - 1).toString()
  elRef.value?.style.setProperty('--mt-index', newIndex)
}

function setOffset() {
  const offset = view.value.dimensions?.height ?? 0
  elRef.value?.style.setProperty('--mt-offset', `${offset}`)
}

onMounted(() => {
  setOffset()
  setIndex()
})

watchEffect(() => {
  setIndex()
})

watch(
  () => view.value.dimensions?.height,
  () => {
    setOffset()
  }
)
</script>

<style>
.magic-toast-view {
  --mt-index: 0;
  --mt-matrix-scale: calc(
    1 - (var(--magic-toast-scale, 0.1) * var(--mt-index, 0))
  );
  --mt-matrix-transform-x: calc(
    var(--magic-toast-transform-factor) * var(--mt-offset) *
      var(--mt-index, 0) * var(--mt-multiplier-x)
  );
  --mt-matrix-transform-y: calc(
    var(--magic-toast-transform-factor) * var(--mt-offset) *
      var(--mt-index, 0) * var(--mt-multiplier-y)
  );
  position: relative;
  list-style: none;
  user-select: none;
  cursor: var(--magic-toast-cursor, grab);
}

.magic-toast-view__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: var(--magic-toast-transition, all 275ms ease);
  transform: matrix(
    var(--mt-matrix-scale),
    0,
    0,
    var(--mt-matrix-scale),
    var(--mt-matrix-transform-x),
    var(--mt-matrix-transform-y)
  );
  & > div {
    display: block;
  }
}

.magic-toast-view[data-expanded='true']:not(:last-child) {
  --mt-matrix-scale: 1;
  --mt-matrix-transform-y: 0;
  --mt-matrix-transform-x: 0;
  padding-bottom: var(--magic-toast-gap, 0.75rem);
}

.magic-toast-view[data-dragging='true'] {
  cursor: var(--magic-toast-cursor-dragging, grabbing);
}
</style>
