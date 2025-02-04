<template>
  <li
    :id="id"
    ref="elRef"
    class="magic-toast-view"
    :data-expanded="state.expanded"
    :data-dragging="view.dragging"
    :data-position="state.options.position"
    :style="{
      '--mt-index': reversedIndex,
      '--mt-offset': offset,
    }"
  >
    <div
      class="magic-toast-view__inner"
      @pointerdown="onPointerdown"
      @click="onClick"
    >
      <div :style="style" class="magic-toast-view__drag">
        <slot />
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
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

const reversedIndex = computed(() => count.value - index - 1)
const offset = computed(() => view.value.dimensions?.height)

const { style, onPointerdown, onClick } = useToastDrag({
  view: view.value,
  instanceId,
})
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
  transition: var(
    --magic-toast-view-transition,
    all var(--magic-toast-duration) var(--ease-in-out)
  );
  transform: matrix(
    var(--mt-matrix-scale),
    0,
    0,
    var(--mt-matrix-scale),
    var(--mt-matrix-transform-x),
    var(--mt-matrix-transform-y)
  );
}

.magic-toast-view__drag {
  display: block;
}

.magic-toast-view[data-expanded='true'] {
  --mt-matrix-scale: 1;
  --mt-matrix-transform-y: 0;
  --mt-matrix-transform-x: 0;
}

.magic-toast-view[data-expanded='true']:not(:first-child) {
  &[data-position='bottom-left'],
  &[data-position='bottom-center'],
  &[data-position='bottom-right'] {
    padding-top: var(--magic-toast-gap, 0.75rem);
  }
}

.magic-toast-view[data-expanded='true']:not(:first-child) {
  &[data-position='top-left'],
  &[data-position='top-center'],
  &[data-position='top-right'] {
    padding-bottom: var(--magic-toast-gap, 0.75rem);
  }
}

.magic-toast-view[data-dragging='true'] {
  cursor: var(--magic-toast-cursor-dragging, grabbing);
}

.magic-toast-view[data-position='center-left'] {
  position: absolute;
}

.magic-toast-view[data-position='center-right'] {
  position: absolute;
}
</style>
