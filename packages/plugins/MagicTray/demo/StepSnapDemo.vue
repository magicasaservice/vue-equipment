<template>
  <magic-tray
    id="magic-tray-step-snap-demo"
    :options="{
      snapPoints: { bottom: [0, 0.25, 0.5, 0.75, 1] },
      snap: { mode: 'step' },
      threshold: { distance: 32 },
    }"
    style="--magic-tray-radius: 0.5rem"
  >
    <template #background>
      <div class="bg-surface-base h-full w-full" />
    </template>
    <div
      class="flex aspect-16/9 w-120 max-w-full items-center justify-center select-none"
    >
      <span>Drag the bottom edge</span>
    </div>
  </magic-tray>
</template>
