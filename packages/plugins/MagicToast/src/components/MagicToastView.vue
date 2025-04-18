<template>
  <li
    class="magic-toast-view"
    :data-id="id"
    :data-expanded="state.expanded"
    :data-dragging="view.dragging"
    :data-position="state.options.position"
    :data-debug="state.options.debug"
    :style="{
      '--mt-index': reversedIndex,
      '--mt-offset': offset,
      '--mt-height': height,
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
import { computed, inject } from 'vue'
import { MagicToastInstanceId } from '../../symbols'
import { useToastState } from '../composables/private/useToastState'
import { useToastDrag } from '../composables/private/useToastDrag'

interface MagicToastViewProps {
  id: string
  index: number
}

const { id, index } = defineProps<MagicToastViewProps>()

const instanceId = inject(MagicToastInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicToastView must be used within a MagicToastProvider')
}

const { initializeState } = useToastState(instanceId)
const state = initializeState()

const count = computed(() => state.views.length)
const view = computed(() => state.views[index])
const reversedIndex = computed(() => count.value - index - 1)

const height = computed(() => `${view.value.dimensions?.height}px`)
const offset = computed(() => {
  const mapped = state.views
    .slice(0, reversedIndex.value)
    .reduce((acc, view) => acc + (view.dimensions?.height ?? 0), 0)

  return `${mapped}px`
})

const { style, onPointerdown, onClick } = useToastDrag({
  view: view.value,
  instanceId,
})
</script>

<style>
:root {
  --magic-toast-view-transition: all var(--magic-toast-animation-duration)
    var(--ease-in-out);
}

.magic-toast-view {
  cursor: var(--magic-toast-view-cursor, grab);
  position: absolute;
  list-style: none;
  user-select: none;

  &[data-position='bottom-left'],
  &[data-position='bottom'],
  &[data-position='bottom-right'] {
    padding-top: var(--magic-toast-gap);
  }

  &[data-position='top-left'],
  &[data-position='top'],
  &[data-position='top-right'] {
    padding-bottom: var(--magic-toast-gap);
  }
}

.magic-toast-view[data-expanded='false'] {
  --mt-scale: max(
    calc(1 - (var(--magic-toast-scale-factor) * var(--mt-index))),
    0
  );
  --mt-translate-y: calc(
    ((var(--magic-toast-overlap-y) * var(--mt-index) * var(--mt-scale))) *
      var(--mt-multiplier-y)
  );
}

.magic-toast-view[data-expanded='true'] {
  --mt-scale: 1;
  --mt-translate-y: calc(var(--mt-offset) * var(--mt-multiplier-y));
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

.magic-toast-view[data-dragging='true'] {
  cursor: var(--magic-toast-view-cursor-dragging, grabbing);
}

.magic-toast-view[data-position='left'] {
  position: absolute;
}

.magic-toast-view[data-position='right'] {
  position: absolute;
}

.magic-toast-view[data-debug='true'] {
  outline: solid 1px green;
  & > * {
    outline: solid 1px red;
  }
}
</style>
