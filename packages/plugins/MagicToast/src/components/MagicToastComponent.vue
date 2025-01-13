<template>
  <li
    :id="id"
    ref="elRef"
    class="magic-toast-component"
    @mouseenter="onMouseenter"
  >
    <div class="magic-toast-component__inner">
      <slot />
    </div>
  </li>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { type ActiveToast } from './../types'

interface MagicToastComponentProps {
  index: number
  total: number
  id: string
  siblings: ActiveToast[]
}

const props = defineProps<MagicToastComponentProps>()
const emit = defineEmits<{
  mouseenter: [event: Event]
}>()

const elRef = ref<HTMLElement | undefined>(undefined)
const newerSiblings = computed(() => {
  return props.siblings.slice(props.index + 1)
})

function setIndex() {
  const index = (props.total - props.index - 1).toString()
  elRef.value?.style.setProperty('--mt-index', index)
}

function setOffset() {
  const offset = newerSiblings.value.reduce((acc, curr) => {
    return acc + curr.height - curr.padding.top - curr.padding.bottom
  }, 0)
  elRef.value?.style.setProperty('--mt-offset', `${offset}`)
}

function onMouseenter(event: Event) {
  emit('mouseenter', event)
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
.magic-toast-component {
  --mt-index: 0;
  --mt-offset: 0;
  --mt-matrix-scale: calc(
    1 - (var(--magic-toast-scale, 0.1) * var(--mt-index, 0))
  );
  --mt-matrix-transform-x: calc(
    var(--magic-toast-transform-x) * var(--mt-index, 0) * var(--mt-multiplier-x)
  );
  --mt-matrix-transform-y: calc(
    var(--magic-toast-transform-y) * var(--mt-index, 0) * var(--mt-multiplier-y)
  );
  position: absolute;
  list-style: none;
}

.magic-toast-component__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: var(--magic-toast-transition, transform 300ms ease);
  transform: matrix(
    var(--mt-matrix-scale),
    0,
    0,
    var(--mt-matrix-scale),
    var(--mt-matrix-transform-x),
    var(--mt-matrix-transform-y)
  );
}

.magic-toast-component.expanded {
  --mt-matrix-scale: 1;
  --mt-matrix-transform-y: calc(var(--mt-offset) * var(--mt-multiplier-y));
  --mt-matrix-transform-x: 0;
  &:not(:last-child) {
    & .magic-toast-component__inner {
      padding-bottom: calc(var(--magic-toast-gap, 0.75rem) * var(--mt-index));
      padding-top: calc(var(--magic-toast-gap, 0.75rem) * var(--mt-index));
    }
  }
}
</style>
