<template>
  <li
    :id="id"
    ref="elRef"
    class="magic-toast-view"
    :data-expanded="state.expanded"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <div class="magic-toast-view__inner" @click="onClick">
      <slot />
    </div>
  </li>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, inject } from 'vue'
import { MagicToastInstanceId } from '../../symbols'
import { useToastState } from '../composables/private/useToastState'
import { useMagicToast } from '../composables/useMagicToast'
import { useToastListener } from '../composables/private/useToastListener'

import '@maas/vue-equipment/utils/css/transitions/fade.css'

interface MagicToastViewProps {
  id: string
  index: number
}

const { index, id } = defineProps<MagicToastViewProps>()

const instanceId = inject(MagicToastInstanceId, undefined)

if (!instanceId) {
  throw new Error('MagicToastView must be used inside MagicToastProvider')
}

const { initializeState } = useToastState(instanceId)
const state = initializeState()

const { count } = useMagicToast(instanceId)

const elRef = ref<HTMLElement | undefined>(undefined)

const { onClick, onMouseenter, onMouseleave } = useToastListener(instanceId)

function setIndex() {
  const newIndex = (count.value - index - 1).toString()
  elRef.value?.style.setProperty('--mt-index', newIndex)
}

function setOffset() {
  const newerSiblings = state.views.slice(index + 1)
  const offset = newerSiblings.reduce((acc, curr) => {
    return (
      acc +
      (curr.dimensions?.height ?? 0) -
      (curr.dimensions?.padding.top ?? 0) -
      (curr.dimensions?.padding.bottom ?? 0)
    )
  }, 0)

  elRef.value?.style.setProperty('--mt-offset', `${offset}`)
}

onMounted(() => {
  setIndex()
  setOffset()
})

watchEffect(() => {
  setIndex()
  setOffset()
})
</script>

<style>
.magic-toast-view {
  --mt-index: 0;
  --mt-offset: 0;
  --mt-matrix-scale: calc(
    1 - (var(--magic-toast-scale, 0.1) * var(--mt-index, 0))
  );
  --mt-matrix-transform-x: calc(
    var(--mt-transform-x) * var(--mt-index, 0) * var(--mt-multiplier-x)
  );
  --mt-matrix-transform-y: calc(
    var(--mt-transform-y) * var(--mt-index, 0) * var(--mt-multiplier-y)
  );
  position: absolute;
  list-style: none;
}

.magic-toast-view__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: var(--magic-toast-transition, transform 275ms ease);
  transform: matrix(
    var(--mt-matrix-scale),
    0,
    0,
    var(--mt-matrix-scale),
    var(--mt-matrix-transform-x),
    var(--mt-matrix-transform-y)
  );
}

.magic-toast-view[data-expanded='true'] {
  --mt-matrix-scale: 1;
  --mt-matrix-transform-y: calc(var(--mt-offset) * var(--mt-multiplier-y));
  --mt-matrix-transform-x: 0;
  &:not(:last-child) {
    & .magic-toast-view__inner {
      padding-bottom: calc(var(--magic-toast-gap, 0.75rem) * var(--mt-index));
      padding-top: calc(var(--magic-toast-gap, 0.75rem) * var(--mt-index));
    }
  }
}
</style>
