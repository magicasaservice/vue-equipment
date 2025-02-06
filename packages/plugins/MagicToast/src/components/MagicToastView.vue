<template>
  <li
    :id="id"
    ref="elRef"
    class="magic-toast-view"
    :data-expanded="state.expanded"
    :data-dragging="view.dragging"
    :data-position="state.options.position"
    :data-perspective="state.options.layout.perspective"
    :data-debug="state.options.debug"
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

const elRef = ref<HTMLElement | undefined>(undefined)

const { initializeState } = useToastState(instanceId)
const state = initializeState()

const count = computed(() => state.views.length)
const view = computed(() => state.views[index])

const reversedIndex = computed(() => count.value - index - 1)
const offset = computed(() => `${view.value.dimensions?.height}px`)

const { style, onPointerdown, onClick } = useToastDrag({
  view: view.value,
  instanceId,
})
</script>

<style>
:root {
  --magic-toast-view-transition: all var(--magic-toast-duration)
    var(--ease-in-out);
}

.magic-toast-view {
  --mt-index: 0;
  --mt-translate-y: 0;
  --mt-scale: max(
    calc(1 - (var(--magic-toast-scale-factor) * var(--mt-index))),
    0
  );
  position: relative;
  list-style: none;
  user-select: none;
  cursor: var(--magic-toast-cursor, grab);
}

.magic-toast-view[data-perspective='true'] {
  --mt-translate-y: calc(
    (
        var(--mt-offset) * var(--mt-index) -
          (var(--magic-toast-overlap-y) * var(--mt-index) * var(--mt-scale))
      ) *
      var(--mt-multiplier-y)
  );
}

.magic-toast-view[data-perspective='false'] {
  --mt-translate-y: calc(
    (
        var(--mt-offset) * var(--mt-index) -
          (var(--magic-toast-overlap-y) * var(--mt-index))
      ) *
      var(--mt-multiplier-y)
  );
}

.magic-toast-view__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: var(--magic-toast-view-transition);
  transform: translateY(var(--mt-translate-y)) scale(var(--mt-scale));
}

.magic-toast-view__drag {
  display: block;
}

.magic-toast-view[data-expanded='true'] {
  --mt-scale: 1;
  --mt-translate-y: 0;
}

.magic-toast-view[data-expanded='true']:not(:first-child) {
  &[data-position='bottom-left'],
  &[data-position='bottom-center'],
  &[data-position='bottom-right'] {
    padding-top: var(--magic-toast-gap);
  }
}

.magic-toast-view[data-expanded='true']:not(:first-child) {
  &[data-position='top-left'],
  &[data-position='top-center'],
  &[data-position='top-right'] {
    padding-bottom: var(--magic-toast-gap);
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

.magic-toast-view[data-debug='true'] {
  outline: solid 1px green;
  & > * {
    outline: solid 1px red;
  }
}
</style>
