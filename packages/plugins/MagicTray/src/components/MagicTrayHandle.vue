<template>
  <div
    class="magic-tray-handle"
    :class="`magic-tray-handle--${side}`"
    :data-side="side"
    role="separator"
    :aria-orientation="orientation"
  >
    <slot :side="side" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { TraySide } from '../types/index'

interface MagicTrayHandleProps {
  side: TraySide
}

const { side } = defineProps<MagicTrayHandleProps>()

const orientation = computed(() =>
  side === 'top' || side === 'bottom' ? 'horizontal' : 'vertical'
)
</script>

<style>
.magic-tray-handle {
  position: absolute;
  z-index: var(--magic-tray-handle-z-index, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
}

.magic-tray-handle--top,
.magic-tray-handle--bottom {
  height: var(--magic-tray-handle-size, 1.5rem);
  cursor: var(--magic-tray-handle-cursor, ns-resize);
  transform: translateY(calc(var(--magic-tray-handle-size, 1.5rem) / -2));
}

.magic-tray-handle--bottom {
  transform: translateY(calc(var(--magic-tray-handle-size, 1.5rem) / 2));
}

.magic-tray-handle--left,
.magic-tray-handle--right {
  width: var(--magic-tray-handle-size, 1.5rem);
  cursor: var(--magic-tray-handle-cursor, ew-resize);
  transform: translateX(calc(var(--magic-tray-handle-size, 1.5rem) / -2));
}

.magic-tray-handle--right {
  transform: translateX(calc(var(--magic-tray-handle-size, 1.5rem) / 2));
}
</style>
