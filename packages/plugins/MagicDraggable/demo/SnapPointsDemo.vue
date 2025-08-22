<template>
  <magic-draggable
    id="magic-draggable-snap-points-demo"
    :options="{
      snapPoints: ['top', 'bottom', 'left', 'right'],
      initial: { snapPoint: 'top' },
    }"
    class="bg-surface-base rounded-md"
  >
    <div
      class="bg-surface-high flex aspect-square w-32 items-center justify-center rounded-md"
    >
      <m-badge>Drag me</m-badge>
    </div>
  </magic-draggable>
</template>

<style>
[data-id='magic-draggable-snap-points-demo'] {
  --magic-draggable-position: relative;
  --magic-draggable-z-index: 50;
  --magic-draggable-height: 20rem;
}
</style>
