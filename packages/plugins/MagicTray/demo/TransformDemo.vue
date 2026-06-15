<template>
  <magic-tray
    id="magic-tray-transform-demo"
    :options="{
      snapPoints: {
        right: [0, 0.25, 0.5],
        bottom: [0, 0.25, 0.5],
      },
      threshold: { distance: 32 },
    }"
    style="--magic-tray-radius: 0.75rem"
  >
    <template #background>
      <div class="bg-surface-base h-full w-full" />
    </template>
    <magic-tray-transform :factor="0.5">
      <div
        class="flex aspect-16/9 w-120 max-w-full flex-col items-center justify-center gap-8 p-8 select-none"
      >
        <p class="text-surface max-w-xs text-center">
          Drag the right or bottom edge
        </p>
      </div>
    </magic-tray-transform>
  </magic-tray>
</template>
