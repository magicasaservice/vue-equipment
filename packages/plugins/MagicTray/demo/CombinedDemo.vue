<template>
  <magic-tray
    id="magic-tray-combined-demo"
    :options="{
      snapPoints: {
        top: [0, 0.2, 0.4],
        right: [0, 0.2, 0.4],
        bottom: [0, 0.2, 0.4],
        left: [0, 0.2, 0.4],
      },
      threshold: {
        distance: 32,
      },
    }"
    style="--magic-tray-radius: 0.75rem"
  >
    <template #background>
      <div class="bg-surface-base h-full w-full" />
    </template>
    <div
      class="flex aspect-16/9 w-120 max-w-full items-center justify-center select-none"
    >
      <span>Drag any edge</span>
    </div>
  </magic-tray>
</template>
