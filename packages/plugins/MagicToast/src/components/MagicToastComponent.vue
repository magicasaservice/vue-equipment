<template>
  <li class="magic-toast-component" ref="elRef" @mouseenter="onMouseenter">
    <div class="magic-toast-component__inner">
      <slot />
    </div>
  </li>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'

interface Props {
  transition: string
  index: number
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  mouseenter: [event: Event]
}>()

const elRef = ref<HTMLElement | undefined>(undefined)

function setIndex() {
  const index = (props.total - props.index - 1).toString()
  elRef.value?.style.setProperty('--mt-index', index)
}

function onMouseenter(event: Event) {
  emit('mouseenter', event)
}

onMounted(() => {
  setIndex()
})

watchEffect(() => setIndex())
</script>

<style lang="css">
.magic-toast-component {
  --mt-index: 0;
  position: absolute;
}

.magic-toast-component__inner {
  position: relative;
  width: 100%;
  height: 100%;
  --mt-matrix-scale: calc(1 - (var(--magic-toast-scale) * var(--mt-index, 0)));
  --mt-matrix-transform: calc(
    var(--magic-toast-transformY) * var(--mt-index, 0) * var(--mt-multiplier)
  );

  transition: var(--magic-toast-transition, transform 300ms ease-out);
  transform: matrix(
    var(--mt-matrix-scale),
    0,
    0,
    var(--mt-matrix-scale),
    0,
    var(--mt-matrix-transform)
  );
}
</style>
