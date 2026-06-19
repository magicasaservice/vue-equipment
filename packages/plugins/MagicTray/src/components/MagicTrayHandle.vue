<template>
  <div
    class="magic-tray-handle"
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

.magic-tray-handle[data-side='top'],
.magic-tray-handle[data-side='bottom'] {
  margin-left: auto;
  margin-right: auto;
}

.magic-tray-handle[data-side='left'],
.magic-tray-handle[data-side='right'] {
  margin-top: auto;
  margin-bottom: auto;
}

.magic-tray-handle[data-side='top'] {
  width: var(
    --magic-tray-handle-width-top,
    var(--magic-tray-handle-width-x, 100%)
  );
  height: var(
    --magic-tray-handle-height-top,
    var(--magic-tray-handle-height-x, 4rem)
  );
  cursor: var(--magic-tray-handle-cursor-top, ns-resize);
  transform: translate(
    var(--magic-tray-handle-offset-x-top, 0%),
    var(--magic-tray-handle-offset-y-top, -50%)
  );
}

.magic-tray-handle[data-side='bottom'] {
  width: var(
    --magic-tray-handle-width-bottom,
    var(--magic-tray-handle-width-x, 100%)
  );
  height: var(
    --magic-tray-handle-height-bottom,
    var(--magic-tray-handle-height-x, 4rem)
  );
  cursor: var(--magic-tray-handle-cursor-bottom, ns-resize);
  transform: translate(
    var(--magic-tray-handle-offset-x-bottom, 0%),
    var(--magic-tray-handle-offset-y-bottom, 50%)
  );
}

.magic-tray-handle[data-side='left'] {
  width: var(
    --magic-tray-handle-width-left,
    var(--magic-tray-handle-width-y, 4rem)
  );
  height: var(
    --magic-tray-handle-height-left,
    var(--magic-tray-handle-height-y, 100%)
  );
  cursor: var(--magic-tray-handle-cursor-left, ew-resize);
  transform: translate(
    var(--magic-tray-handle-offset-x-left, -50%),
    var(--magic-tray-handle-offset-y-left, 0%)
  );
}

.magic-tray-handle[data-side='right'] {
  width: var(
    --magic-tray-handle-width-right,
    var(--magic-tray-handle-width-y, 4rem)
  );
  height: var(
    --magic-tray-handle-height-right,
    var(--magic-tray-handle-height-y, 100%)
  );
  cursor: var(--magic-tray-handle-cursor-right, ew-resize);
  transform: translate(
    var(--magic-tray-handle-offset-x-right, 50%),
    var(--magic-tray-handle-offset-y-right, 0%)
  );
}
</style>
